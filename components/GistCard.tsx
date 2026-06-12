import React, { useEffect, useState } from "react";
import { BookOpenIcon, BookmarkIcon, ExternalLinkIcon } from "./icon";

interface GistData {
  title: string;
  gist: string;
  thumbnail: string | null;
  url: string;
}

interface GistCardProps {
  data: GistData;
}

export default function GistCard({ data }: GistCardProps) {
  const { title, gist, thumbnail, url } = data;
  const [isSaved, setIsSaved] = useState(false);

  // Check if current fact is saved in local storage on title change
  useEffect(() => {
    const items = localStorage.getItem("saved_gists");
    if (items) {
      const list = JSON.parse(items);
      setIsSaved(list.some((item: any) => item.title === title));
    } else {
      setIsSaved(false);
    }
  }, [title]);

  const toggleSave = () => {
    const items = localStorage.getItem("saved_gists");
    let list = items ? JSON.parse(items) : [];
    
    if (isSaved) {
      list = list.filter((item: any) => item.title !== title);
      setIsSaved(false);
    } else {
      list.push({ title, gist, thumbnail, url });
      setIsSaved(true);
    }
    
    localStorage.setItem("saved_gists", JSON.stringify(list));
  };

  return (
    <div className="w-full max-w-[440px] bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.4)] transition-all duration-150 flex flex-col hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_#2C1D11] dark:hover:shadow-[0_8px_0_0_rgba(0,0,0,0.45)]">
      {/* Card Media Header */}
      <div className="w-full aspect-[4/3] relative bg-[#f4edd9] dark:bg-[#1a1715] overflow-hidden border-b-[3px] border-[#2C1D11] dark:border-zinc-800">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover select-none"
            loading="lazy"
          />
        ) : (
          // Elegant editorial fallback pattern
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
            {/* Hand-crafted elegant CSS/SVG emblem */}
            <div className="w-16 h-16 rounded-full border-2 border-coral/30 dark:border-coral/50 flex items-center justify-center mb-3 text-coral">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <span className="font-serif text-sm tracking-wider uppercase text-foreground/45 dark:text-foreground/50">
              Encyclopedia Article
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-8 flex flex-col gap-5 flex-1 justify-between">
        <div className="flex flex-col gap-4">
          
          {/* Card Label and Bookmark Trigger */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs font-black tracking-widest uppercase text-coral select-none">
                Today's nugget 🍪
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C1D11] dark:bg-zinc-800" />
              <span className="font-sans text-xs text-foreground/50 dark:text-foreground/40 font-bold uppercase tracking-widest select-none">
                Wiki Gist
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={toggleSave}
              className={`w-8 h-8 rounded-full border-2 border-[#2C1D11] flex items-center justify-center cursor-pointer active:translate-y-[2px] active:shadow-none transition-all duration-75 shadow-[0_2px_0_0_#2C1D11] dark:shadow-[0_2px_0_0_rgba(0,0,0,0.5)] focus:outline-none select-none ${
                isSaved ? "bg-coral text-white" : "bg-card text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              aria-label={isSaved ? "Unsave gist" : "Save gist"}
            >
              <BookmarkIcon fill={isSaved ? "currentColor" : "none"} className="w-4 h-4" />
            </button>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-extrabold tracking-tight leading-tight">
            {title}
          </h2>

          <div className="h-[2px] w-full bg-[#2C1D11] dark:bg-zinc-800" />

          {/* Gist Text */}
          <p className="font-sans text-base sm:text-lg text-foreground/90 dark:text-foreground/95 leading-relaxed font-semibold select-text">
            {gist}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-black text-foreground/70 hover:text-coral transition-colors duration-200 border-b-2 border-dashed border-foreground/30 hover:border-coral select-none"
          >
            <span>Read more on Wikipedia</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
