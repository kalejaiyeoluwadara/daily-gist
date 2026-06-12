import React, { useState, useEffect } from "react";

interface MascotProps {
  state: "happy" | "thinking" | "shocked";
  className?: string;
  onClick?: () => void;
  outfit?: string; // "detective" | "space" | ""
  isSpeaking?: boolean;
}

export default function NuggyMascot({
  state,
  className = "",
  onClick,
  outfit = "",
  isSpeaking = false,
}: MascotProps) {
  const [isWiggling, setIsWiggling] = useState(false);
  const [mouthCycle, setMouthCycle] = useState(0);

  // Cycle mouth shape while speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthCycle(0);
      return;
    }
    const interval = setInterval(() => {
      setMouthCycle((prev) => (prev + 1) % 3);
    }, 180);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const handleClick = () => {
    setIsWiggling(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => {
      setIsWiggling(false);
    }, 400);
  };

  return (
    <div
      onClick={handleClick}
      className={`w-32 h-32 select-none relative cursor-pointer active:scale-90 hover:scale-105 transition-all duration-150 ${
        isWiggling ? "animate-bounce" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300"
      >
        <defs>
          {/* Body gradient for a 3D baked look */}
          <radialGradient id="bodyGradient" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FBCE9F" />
            <stop offset="60%" stopColor="#E8A36E" />
            <stop offset="100%" stopColor="#C47E49" />
          </radialGradient>

          {/* Foot gradient for rounded depth */}
          <linearGradient id="footGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D2824B" />
            <stop offset="100%" stopColor="#A85C28" />
          </linearGradient>

          {/* Drop shadow filter for chocolate chips to pop out */}
          <filter id="chipShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.4" floodColor="#2C1D11" floodOpacity="0.35" />
          </filter>

          {/* Soft fading cheek blush */}
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8E75" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FF8E75" stopOpacity="0" />
          </radialGradient>

          {/* Space Helmet glossy glass gradient */}
          <radialGradient id="visorGlass" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#56CCF2" stopOpacity="0.18" />
            <stop offset="90%" stopColor="#2F80ED" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.25" />
          </radialGradient>

          {/* Shaded detective hat gradient */}
          <linearGradient id="hatGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A46E47" />
            <stop offset="100%" stopColor="#704323" />
          </linearGradient>
        </defs>

        {/* LEGS / FEET */}
        {/* Left Foot */}
        <rect
          x="42"
          y="93"
          width="14"
          height="14"
          rx="7"
          fill="url(#footGradient)"
          stroke="#2C1D11"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right Foot */}
        <rect
          x="64"
          y="93"
          width="14"
          height="14"
          rx="7"
          fill="url(#footGradient)"
          stroke="#2C1D11"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* COOKIE BODY (Slightly organic/wobbly outline) */}
        <path
          d="M 60 18 C 84 17 101 34 101 58 C 101 82 84 99 60 99 C 36 99 19 82 19 58 C 19 34 36 19 60 18 Z"
          fill="url(#bodyGradient)"
          stroke="#2C1D11"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Highlight overlay for 3D sphere feel */}
        <path
          d="M 60 22 C 78 22 93 34 93 52 C 93 42 78 30 60 30 C 44 30 31 40 31 52 C 31 34 44 22 60 22 Z"
          fill="white"
          opacity="0.18"
        />

        {/* CHOCOLATE CHIPS (with drop shadows and light reflections) */}
        {/* Top Left Chip */}
        <path
          d="M 37 32 C 34 32 32 35 34 38 C 36 41 41 39 40 36 C 39 34 38 32 37 32 Z"
          fill="#4A2310"
          filter="url(#chipShadow)"
        />
        <circle cx="36" cy="34" r="0.8" fill="#FFFFFF" opacity="0.4" />
        
        {/* Bottom Left Chip */}
        <path
          d="M 34 76 C 31 78 33 82 36 81 C 39 80 38 75 35 75 C 34 75 34 75 34 76 Z"
          fill="#4A2310"
          filter="url(#chipShadow)"
        />
        <circle cx="33.8" cy="77.2" r="0.8" fill="#FFFFFF" opacity="0.4" />

        {/* Top Right Chip */}
        <path
          d="M 79 30 C 81 29 85 32 83 34 C 81 36 77 34 78 32 C 79 31 79 30 79 30 Z"
          fill="#4A2310"
          filter="url(#chipShadow)"
        />
        <circle cx="79.5" cy="31.2" r="0.8" fill="#FFFFFF" opacity="0.4" />

        {/* Middle Right Chip */}
        <path
          d="M 83 66 C 85 68 82 72 79 71 C 76 70 78 66 80 66 C 81 66 82 66 83 66 Z"
          fill="#4A2310"
          filter="url(#chipShadow)"
        />
        <circle cx="81.2" cy="67.5" r="0.8" fill="#FFFFFF" opacity="0.4" />

        {/* Center Bottom Chip */}
        <path
          d="M 58 83 C 60 83 62 86 60 88 C 58 90 55 87 56 85 C 57 84 58 83 58 83 Z"
          fill="#4A2310"
          filter="url(#chipShadow)"
        />
        <circle cx="58.2" cy="84.2" r="0.8" fill="#FFFFFF" opacity="0.4" />

        {/* CHEEKS (Soft Radial Blends) */}
        <circle cx="34" cy="62" r="7" fill="url(#cheekGlow)" />
        <circle cx="86" cy="62" r="7" fill="url(#cheekGlow)" />

        {/* STATE-SPECIFIC ARMS */}
        {state === "happy" && (
          <>
            {/* Left Arm raised */}
            <path
              d="M 20 62 C 10 57 6 42 13 36"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm raised */}
            <path
              d="M 100 62 C 110 57 114 42 107 36"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {state === "thinking" && (
          <>
            {/* Left Arm on hip */}
            <path
              d="M 20 64 C 12 68 10 75 15 78"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm touching chin */}
            <path
              d="M 100 64 C 95 58 83 55 76 62"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {state === "shocked" && (
          <>
            {/* Left Arm to cheek */}
            <path
              d="M 20 64 C 12 60 22 51 28 55"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm to cheek */}
            <path
              d="M 100 64 C 108 60 98 51 92 55"
              stroke="#2C1D11"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* STATE-SPECIFIC EYES & EYEBROWS */}
        {state === "happy" && (
          <>
            {/* Left Eyebrow (Curved) */}
            <path
              d="M 36 44 Q 45 40 49 45"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eyebrow (Curved) */}
            <path
              d="M 71 45 Q 75 40 84 44"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Eye */}
            <circle cx="45" cy="53" r="8.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="47" cy="54" r="4.5" fill="#2C1D11" />
            <circle cx="45.5" cy="52" r="1.8" fill="white" />
            {/* Right Eye */}
            <circle cx="75" cy="53" r="8.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="73" cy="54" r="4.5" fill="#2C1D11" />
            <circle cx="71.5" cy="52" r="1.8" fill="white" />
          </>
        )}

        {state === "thinking" && (
          <>
            {/* Left Eyebrow (Raised High) */}
            <path
              d="M 35 42 Q 44 32 49 39"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eyebrow (Lowered/Slanted) */}
            <path
              d="M 70 45 Q 77 44 83 48"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Eye (Looking up/right) */}
            <circle cx="45" cy="53" r="8.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="48" cy="50" r="4.5" fill="#2C1D11" />
            <circle cx="47" cy="48" r="1.8" fill="white" />
            {/* Right Eye (Looking up/right) */}
            <circle cx="75" cy="53" r="8.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="78" cy="50" r="4.5" fill="#2C1D11" />
            <circle cx="77" cy="48" r="1.8" fill="white" />
          </>
        )}

        {state === "shocked" && (
          <>
            {/* Left Eyebrow (Worry slant) */}
            <path
              d="M 36 44 Q 44 43 48 39"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eyebrow (Worry slant) */}
            <path
              d="M 72 39 Q 76 43 84 44"
              stroke="#2C1D11"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Eye (Wide open) */}
            <circle cx="45" cy="53" r="9.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="45" cy="53" r="3.5" fill="#2C1D11" />
            {/* Right Eye (Wide open) */}
            <circle cx="75" cy="53" r="9.5" fill="white" stroke="#2C1D11" strokeWidth="3.5" />
            <circle cx="75" cy="53" r="3.5" fill="#2C1D11" />
            {/* Sweat/Tear drop */}
            <path
              d="M 30 62 Q 28 69 32 69 Q 34 69 32 62 Z"
              fill="#56CCF2"
              stroke="#2C1D11"
              strokeWidth="1.5"
            />
          </>
        )}

        {/* STATE-SPECIFIC MOUTH (Dynamic speaking loop overlay) */}
        {isSpeaking ? (
          <>
            {mouthCycle === 0 && (
              <path
                d="M 52 66 Q 60 77 68 66"
                fill="#2C1D11"
                stroke="#2C1D11"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
            {mouthCycle === 1 && <ellipse cx="60" cy="71" rx="5.5" ry="8.5" fill="#2C1D11" />}
            {mouthCycle === 2 && <ellipse cx="60" cy="70" rx="9" ry="4" fill="#2C1D11" />}
          </>
        ) : state === "happy" ? (
          <>
            {/* Open Happy Mouth */}
            <path
              d="M 52 66 Q 60 77 68 66"
              fill="#2C1D11"
              stroke="#2C1D11"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M 52 66 Q 60 77 68 66 Z" fill="#2C1D11" />
            {/* Tongue */}
            <path
              d="M 56 71 Q 60 76 64 71 C 65 70 63 69 60 69 C 57 69 55 70 56 71 Z"
              fill="#FF85A1"
            />
          </>
        ) : state === "thinking" ? (
          /* Small neutral smirk */
          <path
            d="M 54 69 Q 60 70 65 67"
            stroke="#2C1D11"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          /* Small circular open mouth */
          <ellipse cx="60" cy="71" rx="5.5" ry="8.5" fill="#2C1D11" />
        )}

        {/* OUTFITS OVERLAYS */}
        {outfit === "detective" && (
          <>
            {/* Sherlock Cap Bill */}
            <ellipse
              cx="60"
              cy="23"
              rx="37"
              ry="5"
              fill="url(#hatGradient)"
              stroke="#2C1D11"
              strokeWidth="3.5"
            />
            {/* Crown of hat */}
            <path
              d="M 28 22 C 26 4 94 4 92 22 Z"
              fill="url(#hatGradient)"
              stroke="#2C1D11"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Dark Band */}
            <path
              d="M 29 20 C 50 22 70 22 91 20 L 91 16 C 70 18 50 18 29 16 Z"
              fill="#2C1D11"
            />
          </>
        )}

        {outfit === "space" && (
          <>
            {/* Astronaut Collar Attachment */}
            <rect
              x="50"
              y="97"
              width="20"
              height="5"
              rx="2"
              fill="#e0e0e0"
              stroke="#2C1D11"
              strokeWidth="3.5"
            />
            {/* Space Visor Bubble */}
            <circle
              cx="60"
              cy="58"
              r="44"
              fill="url(#visorGlass)"
              stroke="#2C1D11"
              strokeWidth="3.5"
            />
            {/* Glass highlights reflection */}
            <path
              d="M 26 40 A 38 38 0 0 1 76 22"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            {/* Secondary lower glossy reflection */}
            <path
              d="M 32 76 A 38 38 0 0 0 88 76"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.25"
            />
          </>
        )}
      </svg>
    </div>
  );
}
