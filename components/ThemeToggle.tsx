"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Initial theme check: check localStorage first, fallback to document class
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={toggleTheme}
        className="w-14 h-8 bg-zinc-100 dark:bg-[#1a1715] border-2 border-[#2C1D11] rounded-full relative cursor-pointer active:translate-y-[1px] transition-all shadow-[0_2px_0_0_#2C1D11] dark:shadow-[0_2px_0_0_rgba(0,0,0,0.5)] focus:outline-none"
        aria-label="Toggle Theme"
      >
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 text-xs opacity-50 pointer-events-none select-none">
          <span>☀️</span>
          <span>🌙</span>
        </div>

        {/* Sliding Knobby handle */}
        <div
          className={`w-5 h-5 rounded-full border-2 border-[#2C1D11] absolute top-[3px] transition-all duration-150 shadow-[0_2px_0_0_#2C1D11] ${
            darkMode ? "left-[27px] bg-[#E8A36E]" : "left-[3px] bg-coral"
          }`}
        />
      </button>
    </div>
  );
}
