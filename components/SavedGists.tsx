"use client";

import React, { useEffect, useState } from "react";
import { CloseIcon } from "./icon";

interface SavedGist {
  title: string;
  gist: string;
  url: string;
  thumbnail: string | null;
  source?: string;
}

interface SavedGistsProps {
  onRemoveItem: () => void;
}

export default function SavedGists({ onRemoveItem }: SavedGistsProps) {
  const [savedItems, setSavedItems] = useState<SavedGist[]>([]);

  useEffect(() => {
    const items = localStorage.getItem("saved_gists");
    if (items) {
      setSavedItems(JSON.parse(items));
    }
  }, []);

  const handleDelete = (title: string) => {
    const updated = savedItems.filter((item) => item.title !== title);
    setSavedItems(updated);
    localStorage.setItem("saved_gists", JSON.stringify(updated));
    onRemoveItem();
  };

  if (savedItems.length === 0) {
    return (
      <div className="w-full max-w-[440px] bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-5 shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.4)]">
        <div className="text-4xl select-none">📖</div>
        <h3 className="font-serif text-xl font-extrabold text-foreground">
          Library is Empty
        </h3>
        <p className="font-sans text-sm font-semibold text-foreground/70 leading-relaxed select-text">
          Read nuggets in the Feed tab and tap the bookmark ribbon to save them here for review!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1 pb-16">
      {savedItems.map((item) => {
        const savedThumbnail = item.thumbnail || (item.source === "Hacker News" ? "/hn_fallback.png" : null);
        return (
          <div
            key={item.title}
            className="bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-2xl p-4 flex gap-4 items-center shadow-[0_4px_0_0_#2C1D11] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)] hover:translate-y-[-1px] hover:shadow-[0_5px_0_0_#2C1D11] transition-all"
          >
            {savedThumbnail ? (
              <img
                src={savedThumbnail}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border-2 border-[#2C1D11] dark:border-zinc-700 select-none flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#f4edd9] dark:bg-zinc-800 border-2 border-[#2C1D11] dark:border-zinc-700 flex items-center justify-center text-xl flex-shrink-0 select-none">
                📖
              </div>
            )}

          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            <h4 className="font-serif text-base font-extrabold text-foreground truncate select-text">
              {item.title}
            </h4>
            <p className="font-sans text-xs font-semibold text-foreground/80 leading-normal line-clamp-2 select-text">
              {item.gist}
            </p>
            <div className="flex gap-3 mt-1 select-none">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] font-black text-coral uppercase tracking-wider border-b border-dashed border-coral/50 hover:border-coral"
              >
                {item.source || "Wikipedia"} ↗
              </a>
            </div>
          </div>

          <button
            onClick={() => handleDelete(item.title)}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 text-foreground/50 border-2 border-[#2C1D11] dark:border-zinc-700 rounded-xl cursor-pointer active:translate-y-[2px] transition-all duration-75 flex items-center justify-center flex-shrink-0 select-none focus:outline-none"
            aria-label="Remove item"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        );
      })}
    </div>
  );
}
