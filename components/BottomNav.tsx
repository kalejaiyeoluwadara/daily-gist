import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedIcon, BookmarkIcon, ShopIcon, PlusIcon } from "./icon";

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "", name: "Random", emoji: "🎲" },
  { id: "tech", name: "Tech", emoji: "💻" },
  { id: "history", name: "History", emoji: "🏛️" },
  { id: "nature", name: "Nature", emoji: "🌿" },
  { id: "governance", name: "Governance", emoji: "🗳️" },
  { id: "space", name: "Space", emoji: "🚀" },
];

interface BottomNavProps {
  currentTab: "feed" | "saved" | "shop";
  onTabChange: (tab: "feed" | "saved" | "shop") => void;
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
}

const getAngleForIndex = (index: number) => {
  // Map index 0..5 to angles 190..90 fanning out in a perfect circular arc
  return 190 - index * 20;
};

const getRadiusForIndex = (index: number) => {
  // A uniform radius to form a perfect circular arc
  return 176;
};

export default function BottomNav({
  currentTab,
  onTabChange,
  selectedCategory,
  onCategorySelect,
}: BottomNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const fabRef = useRef<HTMLButtonElement>(null);
  const dragModeRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Capture the pointer events on the FAB
    e.currentTarget.setPointerCapture(e.pointerId);
    dragModeRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    // Toggle the open state on press start
    setIsOpen((prev) => !prev);
    setHoveredId(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isOpen) return;

    const dxFromStart = e.clientX - startPosRef.current.x;
    const dyFromStart = e.clientY - startPosRef.current.y;
    const distFromStart = Math.sqrt(dxFromStart * dxFromStart + dyFromStart * dyFromStart);

    // If moved more than 10px, enter drag select mode
    if (distFromStart > 10) {
      dragModeRef.current = true;
    }

    if (!dragModeRef.current) return;

    if (!fabRef.current) return;
    const rect = fabRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    const dx = e.clientX - cX;
    const dy = e.clientY - cY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle in degrees (0..360)
    let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    // Check if pointer is in the active radius zone of staggered category buttons
    if (dist >= 50 && dist <= 210) {
      let closestId: string | null = null;
      let minDiff = Infinity;

      CATEGORIES.forEach((cat, index) => {
        const catAngle = getAngleForIndex(index);
        let diff = Math.abs(angle - catAngle);
        if (diff > 180) diff = 360 - diff;

        if (diff < minDiff) {
          minDiff = diff;
          closestId = cat.id;
        }
      });

      // Highlight item if within 25 degrees of its angular slot
      if (minDiff < 25) {
        setHoveredId(closestId);
      } else {
        setHoveredId(null);
      }
    } else {
      setHoveredId(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (dragModeRef.current) {
      // Release-to-select action
      if (hoveredId !== null) {
        onCategorySelect(hoveredId);
      }
      setIsOpen(false);
      setHoveredId(null);
    }
  };

  const isAnyHovered = hoveredId !== null;

  return (
    <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-4 z-40 flex items-center gap-3 select-none">
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

      {/* Right Radial Plus FAB Container */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <button
          ref={fabRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] border-[#2C1D11] dark:border-zinc-700 transition-all duration-75 select-none cursor-pointer focus:outline-none flex-shrink-0 z-35 relative ${
            isOpen
              ? "bg-coral text-white shadow-[0_4px_0_0_#bd4c33] active:translate-y-[4px] active:shadow-none"
              : "bg-[#2C1D11] dark:bg-zinc-800 text-white shadow-[0_4px_0_0_#1a100a] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.6)] active:translate-y-[4px] active:shadow-none"
          }`}
          aria-label="Select Category"
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="flex items-center justify-center"
          >
            <PlusIcon className="w-6 h-6" />
          </motion.div>
        </button>

        {/* Radial Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Fullscreen Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-30 bg-black/50 dark:bg-black/70 backdrop-blur-md"
              />

              {/* Dotted indicator line from center to active category */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 overflow-visible pointer-events-none z-32">
                {isAnyHovered && (
                  (() => {
                    const activeIndex = CATEGORIES.findIndex((cat) => cat.id === hoveredId);
                    if (activeIndex === -1) return null;
                    const angle = getAngleForIndex(activeIndex);
                    const radius = getRadiusForIndex(activeIndex);
                    const dx = radius * Math.cos((angle * Math.PI) / 180);
                    const dy = -radius * Math.sin((angle * Math.PI) / 180);

                    return (
                      <motion.line
                        key={hoveredId}
                        initial={{ x2: 0, y2: 0, opacity: 0 }}
                        animate={{ x2: dx, y2: dy, opacity: 0.8 }}
                        x1={0}
                        y1={0}
                        stroke="#2C1D11"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="dark:stroke-zinc-500"
                        transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      />
                    );
                  })()
                )}
              </svg>

              {/* Menu Items Wrapper (anchored relative to the FAB container center) */}
              <div className="absolute inset-0 z-35 pointer-events-none">
                {CATEGORIES.map((cat, index) => {
                  const angle = getAngleForIndex(index);
                  const radius = getRadiusForIndex(index);
                  const dx = radius * Math.cos((angle * Math.PI) / 180);
                  const dy = -radius * Math.sin((angle * Math.PI) / 180);

                  const isHovered = hoveredId === cat.id;
                  const isSelected = selectedCategory === cat.id;

                  // Dim non-hovered items during a drag session
                  const scaleVal = isHovered ? 1.2 : isAnyHovered ? 0.9 : 1.0;
                  const opacityVal = isHovered ? 1.0 : isAnyHovered ? 0.5 : 1.0;

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                      animate={{
                        scale: scaleVal,
                        opacity: opacityVal,
                        x: dx,
                        y: dy,
                      }}
                      exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 26,
                        delay: isOpen ? index * 0.03 : 0, // staggered entrance wave
                      }}
                      className="absolute left-1/2 top-1/2 z-35 pointer-events-none"
                    >
                      <button
                        onMouseEnter={() => setHoveredId(cat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => {
                          onCategorySelect(cat.id);
                          setIsOpen(false);
                          setHoveredId(null);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 px-3.5 py-2 rounded-full border-[3px] border-[#2C1D11] dark:border-zinc-800 shadow-[0_4px_0_0_#2C1D11] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.5)] cursor-pointer select-none pointer-events-auto transition-all duration-150 whitespace-nowrap text-[10px] font-black uppercase tracking-wider ${
                          isHovered
                            ? "bg-coral text-white z-45 -translate-y-[55%] shadow-[0_6px_0_0_#2C1D11]"
                            : isSelected
                            ? "bg-amber-100 dark:bg-zinc-700 text-[#2C1D11] dark:text-foreground"
                            : "bg-card text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                        aria-label={`Select category: ${cat.name}`}
                      >
                        <span className="mr-1.5 text-xs">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
