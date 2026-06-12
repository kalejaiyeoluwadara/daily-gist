import React from "react";

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { id: "", name: "Random", emoji: "🎲" },
  { id: "tech", name: "Tech", emoji: "💻" },
  { id: "history", name: "History", emoji: "🏛️" },
  { id: "nature", name: "Nature", emoji: "🌿" },
  { id: "governance", name: "Governance", emoji: "🗳️" },
  { id: "space", name: "Space", emoji: "🚀" },
];

interface CategorySelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export default function CategorySelector({ selectedId, onSelect, disabled }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 max-w-md w-full px-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            disabled={disabled}
            className={`px-3.5 py-1.5 font-sans text-xs sm:text-sm font-extrabold rounded-xl border-2 border-[#2C1D11] dark:border-zinc-800 select-none cursor-pointer transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none ${
              isSelected
                ? "bg-coral text-white translate-y-[3px] shadow-none"
                : "bg-card text-foreground shadow-[0_3px_0_0_#2C1D11] dark:shadow-[0_3px_0_0_rgba(0,0,0,0.4)] hover:bg-[#faf7f2]/50 hover:translate-y-[-1px] hover:shadow-[0_4px_0_0_#2C1D11] dark:hover:bg-zinc-800/50"
            }`}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
