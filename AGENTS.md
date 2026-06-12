# Daily Gist

A simple full-stack Next.js app that gives users a random, interesting fact from Wikipedia — "gisted" into a short, casual, shareable nugget of knowledge.

## Concept

On page load, the app immediately fetches a random Wikipedia article summary, optionally rewrites it into a friendly "did you know" tone via Gemini, and displays it as a card with the title, image, gist text, and a link to read more. No button needed — the gist is the first thing users see.

A "Next Gist" / refresh action lets users get another one.

No login, no database, no cron — purely on-demand for v1.

## Stack

- **Next.js (App Router)** — fullstack, API routes handle the fetch/rewrite logic
- **Wikipedia REST API** — `https://en.wikipedia.org/api/rest_v1/page/random/summary`
- **Gemini API** (optional rewrite layer) — `gemini-2.0-flash`
- **Tailwind CSS** — styling

## Architecture

```
/app
  /page.tsx              → main UI, fetches gist on load, shows skeleton then card
  /api/gist/route.ts     → fetches Wikipedia random summary, sends to Gemini, returns JSON
/components
  /GistCard.tsx          → displays title, image, gist text, source link
  /GistSkeleton.tsx      → skeleton loader shown while fetching
  /RefreshButton.tsx     → "Next Gist" action to fetch another
```

## API Response Shape

```json
{
  "title": "Article Title",
  "gist": "Casual rewritten fact text...",
  "thumbnail": "https://...",
  "url": "https://en.wikipedia.org/wiki/Article_Title"
}
```

## Styling Direction

**Vibe:** playful, editorial, "knowledge snack" — think a single trading card or postcard, not a dense article page.

- **Layout:** centered single card, generous whitespace, mobile-first (most users will tap this casually on phone)
- **Typography:** a serif or slab-serif for the title (gives it an "encyclopedia meets magazine" feel), clean sans-serif for body text
- **Color palette:** warm off-white/cream background, one accent color (amber, teal, or coral) for the button and highlights — avoid sterile pure white/blue "tech" look
- **Card design:** soft shadow, rounded corners (12–16px), thumbnail image at top with slight overlay/gradient, title below, gist text as the focal point in larger readable font
- **Refresh action:** small, secondary — pill-shaped icon/button (e.g., "Next Gist 🔄") below the card, subtle hover/tap animation
- **Microcopy:** friendly tone — "Today's nugget 🍪", "Next Gist", "Read more on Wikipedia"
- **Loading state:** skeleton card matching the final layout (shimmer block for image, title, and text lines) shown immediately on page load — no spinners or "Gist Me" buttons
- **Empty/error state:** light, non-technical message ("Couldn't find a gist — try again?") with a retry action

## v1 Scope

- [ ] Single page that fetches gist automatically on load
- [ ] API route fetches random Wikipedia summary
- [ ] Optional Gemini rewrite (env var toggle: if no API key, show raw extract)
- [ ] Skeleton loader matching final card layout
- [ ] Responsive card layout with Tailwind
- [ ] "Next Gist" refresh action
- [ ] Error state with retry

## Future Enhancements (not v1)

- Daily cron job + caching so all users see the same "fact of the day"
- "On this day" historical facts mode
- Save/bookmark favorite gists (requires DB)
- Streak tracking / notifications
- Category filters (science, history, pop culture, etc.)