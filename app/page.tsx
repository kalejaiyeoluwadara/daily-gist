"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import GistCard from "@/components/GistCard";
import GistSkeleton from "@/components/GistSkeleton";
import RefreshButton from "@/components/RefreshButton";
import NuggyMascot from "@/components/NuggyMascot";
import SpeechBubble from "@/components/SpeechBubble";
import CategorySelector from "@/components/CategorySelector";
import ThemeToggle from "@/components/ThemeToggle";
import StatsModal from "@/components/StatsModal";
import BottomNav from "@/components/BottomNav";
import SavedGists from "@/components/SavedGists";
import GistShop from "@/components/GistShop";
import { WarningIcon } from "@/components/icon";

interface GistData {
  title: string;
  gist: string;
  thumbnail: string | null;
  url: string;
}

const LOADING_PHRASES = [
  "Hold on, sniffing out a juicy fact cookie... 🍪",
  "Let me check the Wikipedia archives... 🧐",
  "Gathering chocolate chips of wisdom... ✨",
  "Mixing up a fresh batch of knowledge... 🥣",
];

const SUCCESS_PHRASES = [
  "Oh wow! I didn't see that coming! 😮",
  "Double chocolate chip! This fact is tasty! 🍪",
  "Fascinating! My cookie brain is expanding! 🧠",
  "Did you know this one? I'm impressed! 🌟",
  "That's a golden nugget of wisdom! 🏆",
  "A freshly baked fact, just for you! 🥖",
];

const ERROR_PHRASES = [
  "Oh crumbs! Something went wrong... 😭",
  "The Wi-Fi jar is empty! Try again? 🫙",
  "My chips got scrambled! Let's retry. 🌀",
];

const getRandomPhrase = (state: "thinking" | "happy" | "shocked") => {
  const list =
    state === "thinking"
      ? LOADING_PHRASES
      : state === "happy"
      ? SUCCESS_PHRASES
      : ERROR_PHRASES;
  return list[Math.floor(Math.random() * list.length)];
};

export default function Home() {
  const [gist, setGist] = useState<GistData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<"feed" | "saved" | "shop">("feed");

  // Category state
  const [category, setCategory] = useState<string>("");

  // Mascot state
  const [mascotState, setMascotState] = useState<"happy" | "thinking" | "shocked">("thinking");
  const [speechText, setSpeechText] = useState<string>("Let's find some tasty knowledge! 🍪");
  const [activeOutfit, setActiveOutfit] = useState<string>("");

  // Speech Voice states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState<boolean>(false);

  // Gamification state
  const [cookies, setCookies] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [showFloatAnim, setShowFloatAnim] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<"streak" | "cookies" | null>(null);

  // Load scores on mount
  useEffect(() => {
    // Check speech API support
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setHasVoiceSupport(true);
    }

    const savedCookies = localStorage.getItem("cookies_balance");
    if (savedCookies) {
      setCookies(parseInt(savedCookies, 10));
    }

    const savedOutfit = localStorage.getItem("active_outfit");
    if (savedOutfit) {
      setActiveOutfit(savedOutfit);
    }
    
    const savedStreak = localStorage.getItem("streak_count");
    const lastReadDateStr = localStorage.getItem("last_read_date");
    if (savedStreak) {
      let currentStreak = parseInt(savedStreak, 10);
      if (lastReadDateStr) {
        const lastRead = new Date(lastReadDateStr);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastRead.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          currentStreak = 0;
          localStorage.setItem("streak_count", "0");
        }
      }
      setStreak(currentStreak);
    }
    
    fetchGist("");
  }, []);

  // Cancel any ongoing speech when tab changes
  useEffect(() => {
    stopSpeech();
    
    if (activeTab === "saved") {
      setMascotState("happy");
      setSpeechText("Look at all this delicious knowledge you saved! 📖");
    } else if (activeTab === "feed") {
      setMascotState(gist ? "happy" : "thinking");
      setSpeechText(gist ? "Welcome back to the cookie feed! 🍪" : "Sniffing out a good fact... 🍪");
    }
  }, [activeTab]);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      stopSpeech();
    } else {
      if (!gist) return;
      window.speechSynthesis.cancel();

      // Ripped text content to read
      const textToSpeak = `${gist.title}. Did you know? ${gist.gist}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        setIsSpeaking(false);
        setMascotState("happy");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setMascotState("happy");
      };

      setIsSpeaking(true);
      setMascotState("happy");
      window.speechSynthesis.speak(utterance);
    }
  };

  const awardPoints = () => {
    setShowFloatAnim(true);
    setTimeout(() => setShowFloatAnim(false), 1000);

    const newBalance = cookies + 10;
    setCookies(newBalance);
    localStorage.setItem("cookies_balance", newBalance.toString());

    const today = new Date();
    const todayStr = today.toDateString();
    const lastReadDateStr = localStorage.getItem("last_read_date");
    
    if (lastReadDateStr !== todayStr) {
      let newStreak = streak;
      if (!lastReadDateStr) {
        newStreak = 1;
      } else {
        const lastRead = new Date(lastReadDateStr);
        const diffTime = Math.abs(today.getTime() - lastRead.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          newStreak = streak + 1;
        } else {
          newStreak = 1;
        }
      }
      setStreak(newStreak);
      localStorage.setItem("streak_count", newStreak.toString());
      localStorage.setItem("last_read_date", todayStr);
    }
  };

  const fetchGist = async (catId: string = category) => {
    stopSpeech();
    setIsLoading(true);
    setError(null);
    setMascotState("thinking");
    setSpeechText(getRandomPhrase("thinking"));
    try {
      const res = await fetch(`/api/gist?category=${catId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch next gist");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setGist(data);
      setMascotState("happy");
      setMascotTextAndAward(data);
    } catch (err: any) {
      console.error(err);
      setError("Couldn't retrieve today's nugget. Give it another try?");
      setMascotState("shocked");
      setSpeechText(getRandomPhrase("shocked"));
    } finally {
      setIsLoading(false);
    }
  };

  const setMascotTextAndAward = (data: GistData) => {
    awardPoints();
    setSpeechText(getRandomPhrase("happy"));
  };

  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    stopSpeech();

    const remarks: Record<string, string> = {
      tech: "Ooh, a gadget explorer! Let's scan some tech... 💻",
      history: "Traveling back in time! Dusting off the history books... 🏛️",
      nature: "Nature is calling! Let's explore the wild... 🌿",
      governance: "Politics and rule! Let's check out governance... 🗳️",
      space: "To the stars! Scanning the universe... 🚀",
      "": "Surprise me! Rolling the dice... 🎲",
    };

    setSpeechText(remarks[catId] || "Let's see what we can find!");
    setMascotState("thinking");
    fetchGist(catId);
  };

  const handleMascotPoke = () => {
    if (isSpeaking) {
      setSpeechText("Shh, I'm reading aloud right now! 🤫");
      return;
    }
    const pokeRemarks = [
      "Hey! That tickles! 🍪",
      "Please don't eat me, I'm full of knowledge! 🧠",
      "Every poke makes my chocolate chips wiggle! 🍪",
      "Ooh, a fresh batch of pokes! 🥣",
      "You're wiggling my crumbs! 😂",
      "I'm just a cookie in a giant digital world... 🌏",
      "Poke me again and I'll eat myself! 😋",
    ];
    setSpeechText(pokeRemarks[Math.floor(Math.random() * pokeRemarks.length)]);
    setMascotState("happy");
  };

  const handleShopAction = () => {
    // Reload balance
    const savedCookies = localStorage.getItem("cookies_balance");
    if (savedCookies) {
      setCookies(parseInt(savedCookies, 10));
    }

    // Reload active outfit
    const savedOutfit = localStorage.getItem("active_outfit") || "";
    setActiveOutfit(savedOutfit);

    // Mascot comments immediately on equip
    setMascotState("happy");
    if (savedOutfit === "detective") {
      setSpeechText("Aha! The game is afoot! 🕵️");
    } else if (savedOutfit === "space") {
      setSpeechText("Ground control to Major Nuggy! 🚀");
    } else {
      setSpeechText("Ah, back to my crumbs! 🍪");
    }
  };

  const handleRemoveSavedItem = () => {
    // Just generic state hooks reload
  };

  return (
    <div className="flex-1 flex flex-col items-center min-h-screen py-6 px-4 select-none pb-28">
      
      {/* Duolingo style stats top bar */}
      <div className="w-full max-w-md flex items-center justify-between border-b-2 border-card-border pb-4 mb-6 px-2">
        <h1 className="font-serif text-2xl font-black tracking-tight text-foreground select-none">
          Daily Gist 🍪
        </h1>
        <div className="flex items-center gap-4 relative">
          
          {/* Streak Flame */}
          <div
            onClick={() => setActiveModal("streak")}
            className="flex items-center gap-1 font-sans text-sm font-extrabold text-orange-500 select-none cursor-pointer active:scale-95 transition-all duration-75"
          >
            <span>🔥</span>
            <span>{streak}d</span>
          </div>

          {/* Cookie jar counter */}
          <div
            onClick={() => setActiveModal("cookies")}
            className="flex items-center gap-1 font-sans text-sm font-extrabold text-coral select-none cursor-pointer active:scale-95 transition-all duration-75 relative"
          >
            <span>🍪</span>
            <span>{cookies}</span>

            {/* Flying coin point award bubble */}
            {showFloatAnim && (
              <span className="absolute -top-6 left-2 font-sans text-xs font-black text-coral animate-float-up pointer-events-none">
                +10
              </span>
            )}
          </div>

          {/* Theme switcher */}
          <ThemeToggle />
        </div>
      </div>

      <main className="flex flex-col items-center gap-6 w-full max-w-md flex-1">
        {/* PANEL ROUTING */}
        
        {activeTab === "feed" && (
          <>
            {/* Category Selector */}
            <CategorySelector
              selectedId={category}
              onSelect={handleCategorySelect}
              disabled={isLoading}
            />

            {/* Mascot & Speech Bubble */}
            <div className="flex flex-col items-center gap-4 w-full select-none mt-2">
              <SpeechBubble text={speechText} />
              <NuggyMascot
                state={mascotState}
                onClick={handleMascotPoke}
                outfit={activeOutfit}
                isSpeaking={isSpeaking}
              />
            </div>

            {isLoading ? (
              <GistSkeleton />
            ) : error ? (
              /* Error State styling: clean, postcard fallback box */
              <div className="w-full bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-6 shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.4)]">
                <div className="w-12 h-12 rounded-full bg-coral-light flex items-center justify-center text-coral mb-1 border-2 border-[#2C1D11]">
                  <WarningIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-xl font-extrabold text-foreground">
                    Connection Hiccup
                  </h3>
                  <p className="font-sans text-sm font-semibold text-foreground/70 leading-relaxed select-text">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => fetchGist()}
                  className="relative px-6 py-2.5 bg-coral text-white text-xs font-black rounded-full border-2 border-[#2C1D11] shadow-[0_3px_0_0_#2C1D11] hover:bg-[#ee7e63] active:translate-y-[3px] active:shadow-none transition-all duration-75 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : (
              gist && <GistCard data={gist} />
            )}

            {/* Show next action when not showing error */}
            {!error && (
              <div className="flex flex-col items-center mt-2">
                <RefreshButton onClick={() => fetchGist()} isLoading={isLoading} />
              </div>
            )}
          </>
        )}

        {activeTab === "saved" && (
          <>
            {/* Mascot welcoming user in saved tab */}
            <div className="flex flex-col items-center gap-4 w-full select-none mt-2">
              <SpeechBubble text={speechText} />
              <NuggyMascot
                state={mascotState}
                onClick={handleMascotPoke}
                outfit={activeOutfit}
              />
            </div>
            
            <SavedGists onRemoveItem={handleRemoveSavedItem} />
          </>
        )}

        {activeTab === "shop" && (
          <>
            {/* Mascot in Outfit preview pose at top of shop */}
            <div className="flex flex-col items-center gap-4 w-full select-none mt-2 mb-2">
              <SpeechBubble text={speechText} />
              <NuggyMascot
                state="happy"
                onClick={handleMascotPoke}
                outfit={activeOutfit}
              />
            </div>
            
            <GistShop cookiesBalance={cookies} onPurchaseOrEquip={handleShopAction} />
          </>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav
        currentTab={activeTab}
        onTabChange={setActiveTab}
        isSpeaking={isSpeaking}
        onVoiceClick={toggleVoice}
        hasVoiceSupport={hasVoiceSupport}
      />

      {/* Stats Modal Animations */}
      <AnimatePresence>
        {activeModal && (
          <StatsModal
            type={activeModal}
            onClose={() => setActiveModal(null)}
            streak={streak}
            cookies={cookies}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
