import React from "react";

export default function GistSkeleton() {
  return (
    <div className="w-full max-w-[440px] bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.4)] transition-all duration-150">
      {/* Thumbnail placeholder with aspect ratio */}
      <div className="w-full aspect-[4/3] bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse border-b-[3px] border-[#2C1D11] dark:border-zinc-800" />
      
      {/* Card Content */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {/* Subtitle tag */}
          <div className="h-4 w-24 bg-zinc-200/60 dark:bg-zinc-800/60 rounded animate-pulse" />
          
          {/* Title - 2 lines */}
          <div className="h-7 w-3/4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded animate-pulse" />
          <div className="h-7 w-1/2 bg-zinc-200/60 dark:bg-zinc-800/60 rounded animate-pulse" />
        </div>
        
        {/* Divider */}
        <div className="h-[2px] w-full bg-[#2C1D11] dark:bg-zinc-800" />
        
        {/* Gist Text - 3 lines */}
        <div className="flex flex-col gap-3">
          <div className="h-4 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded animate-pulse" />
        </div>
        
        {/* Source link placeholder */}
        <div className="h-4 w-28 bg-zinc-200/50 dark:bg-zinc-800/50 rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}
