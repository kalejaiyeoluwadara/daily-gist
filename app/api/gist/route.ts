import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CATEGORY_MAP: Record<string, string> = {
  tech: "Category:Computing",
  history: "Category:History",
  nature: "Category:Natural_history",
  governance: "Category:Politics",
  space: "Category:Astronomy",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toLowerCase() || "";

    let wikiData: any = null;
    let title = "Unknown Fact";
    let extract = "";
    let thumbnail = null;
    let url = "";

    // 1. Try to fetch category page from Wikipedia if valid category provided
    if (category && CATEGORY_MAP[category]) {
      try {
        const categoryTitle = CATEGORY_MAP[category];
        const categoryUrl = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
          categoryTitle
        )}&cmlimit=150&format=json&origin=*`;

        const catRes = await fetch(categoryUrl, {
          headers: {
            "User-Agent": "DailyGistApp/1.0 (contact: admin@dailygistapp.com)",
          },
          cache: "no-store",
        });

        if (catRes.ok) {
          const catData = await catRes.json();
          const members = catData.query?.categorymembers || [];
          
          // Filter to select only standard namespace pages (ns === 0), ignoring Category subfolders (ns === 14)
          const articles = members.filter((m: any) => m.ns === 0);

          if (articles.length > 0) {
            // Pick a random article
            const randomArticle = articles[Math.floor(Math.random() * articles.length)];
            const articleTitle = randomArticle.title;
            const safeTitle = articleTitle.replace(/ /g, "_");

            // Fetch summary for this specific article
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(safeTitle)}`;
            const sumRes = await fetch(summaryUrl, {
              headers: {
                "User-Agent": "DailyGistApp/1.0 (contact: admin@dailygistapp.com)",
              },
              cache: "no-store",
            });

            if (sumRes.ok) {
              wikiData = await sumRes.json();
            }
          }
        }
      } catch (err) {
        console.error("Failed to query category, falling back to random Wikipedia endpoint:", err);
      }
    }

    // 2. Fallback to random Wikipedia summary if no category was fetched successfully
    if (!wikiData) {
      const wikiRes = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary", {
        headers: {
          "User-Agent": "DailyGistApp/1.0 (contact: admin@dailygistapp.com)",
        },
        cache: "no-store",
      });

      if (!wikiRes.ok) {
        throw new Error(`Wikipedia random API failed with status ${wikiRes.status}`);
      }

      wikiData = await wikiRes.json();
    }

    // 3. Extract Wikipedia fields
    title = wikiData.title || "Unknown Fact";
    extract = wikiData.extract || "";
    thumbnail = wikiData.thumbnail?.source || null;
    url = wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;

    let gist = extract;

    // 4. Optional Gemini Rewrite Layer
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && extract.trim().length > 0) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const systemPrompt = `You are an editorial copywriter for "Daily Gist", a playful and smart knowledge snack app. 
Your task is to rewrite a Wikipedia article summary into an engaging, casual, and friendly "did you know" nugget of knowledge.

Rules:
1. Start with "Did you know..." or present it as a fun, quick fact.
2. Keep it concise: exactly 1 or 2 sentences (max 40-50 words).
3. The tone must be smart, witty, and editorial—like a premium postcard fact or trading card.
4. Do NOT use generic AI filler words (e.g. "delve", "testament", "nestled", "sparkles").
5. Do NOT output markdown formatting, bold text (no **), HTML, quotes, or conversational preamble. Output ONLY the rewritten fact text.`;

        const userPrompt = `Article: ${title}\nSummary: ${extract}`;

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: systemPrompt },
                  { text: userPrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            }
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          const rewrittenText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (rewrittenText) {
            // Remove double quotes, single quotes or surrounding backticks if Gemini added any
            gist = rewrittenText.replace(/^["'`]/, "").replace(/["'`]$/, "");
          }
        } else {
          console.error("Gemini API call failed with status:", response.status);
        }
      } catch (err) {
        console.error("Error during Gemini rewrite, falling back to raw extract:", err);
      }
    }

    return NextResponse.json({
      title,
      gist,
      thumbnail,
      url,
    });
  } catch (error: any) {
    console.error("Gist API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch gist" },
      { status: 500 }
    );
  }
}
