import React from "react";
import { RefreshIcon } from "./icon";

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="relative px-8 py-3.5 bg-coral text-white font-sans font-extrabold text-base rounded-2xl border-2 border-[#2C1D11] shadow-[0_4px_0_0_#2C1D11] hover:bg-[#ee7e63] dark:hover:bg-[#f38d74] active:translate-y-[4px] active:shadow-none transition-all duration-75 disabled:opacity-60 disabled:pointer-events-none select-none cursor-pointer flex items-center gap-3"
    >
      <span>Next Gist</span>
      <RefreshIcon className={`w-5 h-5 transition-transform duration-500 ${isLoading ? "animate-spin" : ""}`} />
    </button>
  );
}
