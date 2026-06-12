import React from "react";
import { FeedIcon, BookmarkIcon, ShopIcon, SpeakerIcon } from "./icon";

interface BottomNavProps {
  currentTab: "feed" | "saved" | "shop";
  onTabChange: (tab: "feed" | "saved" | "shop") => void;
  isSpeaking: boolean;
  onVoiceClick: () => void;
  hasVoiceSupport: boolean;
}

export default function BottomNav({
  currentTab,
  onTabChange,
  isSpeaking,
  onVoiceClick,
  hasVoiceSupport,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 flex items-center gap-3 select-none">
      {/* Left Pill Navigation */}
      <div className="flex-1 bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-full px-1 py-[6px] flex items-center justify-around shadow-[0_4px_0_0_#2C1D11] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.5)]">
        {/* Feed Tab */}
        <button
          onClick={() => onTabChange("feed")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-full font-sans text-[10px] font-black transition-all duration-150 cursor-pointer border-2 border-transparent ${
            currentTab === "feed"
              ? "bg-zinc-100 dark:bg-zinc-800 px-7 text-coral"
              : "text-foreground/60 hover:text-foreground/90"
          }`}
        >
          <FeedIcon className="w-5 h-5 flex-shrink-0" />
          <span>Feed</span>
        </button>

        {/* Saved Tab */}
        <button
          onClick={() => onTabChange("saved")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl font-sans text-[10px] font-black transition-all duration-150 cursor-pointer border-2 border-transparent ${
            currentTab === "saved"
              ? "bg-zinc-100 dark:bg-zinc-800 rounded-full px-7 text-coral"
              : "text-foreground/60 hover:text-foreground/90"
          }`}
        >
          <BookmarkIcon className="w-5 h-5 flex-shrink-0" />
          <span>Library</span>
        </button>

        {/* Shop Tab */}
        <button
          onClick={() => onTabChange("shop")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl font-sans text-[10px] font-black transition-all duration-150 cursor-pointer border-2 border-transparent ${
            currentTab === "shop"
              ? "bg-zinc-100 dark:bg-zinc-800 rounded-full px-7 text-coral"
              : "text-foreground/60 hover:text-foreground/90"
          }`}
        >
          <ShopIcon className="w-5 h-5 flex-shrink-0" />
          <span>Shop</span>
        </button>
      </div>

      {/* Right Voice FAB */}
      {hasVoiceSupport && (
        <button
          onClick={onVoiceClick}
          className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] border-[#2C1D11] dark:border-zinc-700 transition-all duration-75 select-none cursor-pointer focus:outline-none flex-shrink-0 ${
            isSpeaking
              ? "bg-coral text-white shadow-[0_4px_0_0_#bd4c33] active:translate-y-[4px] active:shadow-none"
              : "bg-[#2C1D11] dark:bg-zinc-800 text-white shadow-[0_4px_0_0_#1a100a] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-[4px] active:shadow-none"
          }`}
          aria-label={isSpeaking ? "Stop Voice" : "Read Aloud"}
        >
          {isSpeaking ? (
            /* Animated soundwave bars */
            <div className="flex items-end gap-[3px] h-5">
              <span className="w-[3px] h-3 bg-white rounded-full animate-pulse" />
              <span className="w-[3px] h-5 bg-white rounded-full animate-bounce" />
              <span className="w-[3px] h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-[3px] h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="w-[3px] h-2.5 bg-white rounded-full animate-pulse" />
            </div>
          ) : (
            /* Soundwave speaker icon */
            <SpeakerIcon className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
}
