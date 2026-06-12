import React from "react";

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="relative bg-card border-2 border-card-border text-foreground rounded-2xl px-5 py-3.5 max-w-[260px] sm:max-w-[320px] text-center shadow-[4px_4px_0px_0px_rgba(44,44,44,0.04)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] transition-all duration-300">
      <p className="font-sans text-sm font-extrabold leading-normal tracking-wide text-foreground/90 dark:text-foreground/95 select-text">
        {text}
      </p>
      {/* Speech bubble tail pointing downwards */}
      <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r-2 border-b-2 border-card-border rotate-45" />
    </div>
  );
}
