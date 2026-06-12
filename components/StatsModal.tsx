"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatsModalProps {
  type: "streak" | "cookies" | null;
  onClose: () => void;
  streak: number;
  cookies: number;
}

export default function StatsModal({ type, onClose, streak, cookies }: StatsModalProps) {
  if (!type) return null;

  const isStreak = type === "streak";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#141210]/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.9, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 15, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-card border-[3px] border-[#2C1D11] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center shadow-[0_6px_0_0_#2C1D11] dark:shadow-[0_6px_0_0_rgba(0,0,0,0.45)] relative flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Absolute Chunky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#2C1D11] bg-card text-[#2C1D11] font-sans font-black text-xs shadow-[0_2px_0_0_#2C1D11] hover:bg-zinc-100 active:translate-y-[2px] active:shadow-none transition-all duration-75 flex items-center justify-center cursor-pointer select-none focus:outline-none"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Decorative Badge */}
        {isStreak ? (
          <div className="w-18 h-18 bg-orange-50 dark:bg-orange-950/20 border-2 border-[#2C1D11] dark:border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-[0_3px_0_0_#2C1D11] dark:shadow-[0_3px_0_0_rgba(0,0,0,0.3)] select-none">
            🔥
          </div>
        ) : (
          <div className="w-18 h-18 bg-[#fef8f6] dark:bg-amber-950/20 border-2 border-[#2C1D11] dark:border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-[0_3px_0_0_#2C1D11] dark:shadow-[0_3px_0_0_rgba(0,0,0,0.3)] select-none">
            🍪
          </div>
        )}

        {/* Modal Headings */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-xs font-black tracking-widest uppercase text-coral">
            {isStreak ? "Streak Metrics" : "Cookie Jar Balance"}
          </span>
          <h2 className="font-serif text-2xl font-black text-foreground">
            {isStreak ? "Daily Streak" : "Cookie Points"}
          </h2>
        </div>

        <div className="h-[2px] w-full bg-[#2C1D11] dark:bg-zinc-800" />

        {/* Description Text */}
        <p className="font-sans text-sm font-bold text-foreground/80 leading-relaxed select-text">
          {isStreak ? (
            <>
              You have maintained a learning habit of <span className="text-orange-500 font-extrabold">{streak} {streak === 1 ? "day" : "days"}</span> in a row! Visit every day to scan fresh nuggets of knowledge and keep Nuggy happy! 🔥
            </>
          ) : (
            <>
              You have accumulated <span className="text-coral font-extrabold">{cookies} Cookie Points</span>! Nuggy awards you <span className="font-extrabold">+10 🍪</span> points for every Wikipedia summary you read. Keep reading to earn more! 🍪
            </>
          )}
        </p>

        {/* Chunky Action Buttons */}
        <button
          onClick={onClose}
          className={`w-full py-3 text-white font-sans font-extrabold text-sm rounded-xl border-2 border-[#2C1D11] shadow-[0_4px_0_0_#2C1D11] active:translate-y-[4px] active:shadow-none transition-all duration-75 cursor-pointer select-none ${
            isStreak
              ? "bg-coral hover:bg-[#ee7e63]"
              : "bg-[#E8A36E] hover:bg-[#eeb180]"
          }`}
        >
          {isStreak ? "Keep it burning! 🔥" : "Feed me more facts! 😋"}
        </button>
      </motion.div>
    </motion.div>
  );
}
