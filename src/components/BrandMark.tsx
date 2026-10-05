import React from "react";
import Link from "next/link";

interface BrandMarkProps {
  className?: string;
  variant?: "full" | "mark" | "compact";
  theme?: "light" | "dark";
}

export default function BrandMark({
  className = "",
  variant = "full",
  theme = "light",
}: BrandMarkProps) {
  const isDark = theme === "dark";
  const primaryStroke = isDark ? "#FFFFFF" : "#17242D";
  const ringStroke = isDark ? "#53636E" : "#DCE3E7";
  const primaryFill = isDark ? "#FFFFFF" : "#17242D";
  const subtitleFill = isDark ? "#DCE3E7" : "#53636E";

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className || "w-8 h-8"}
      >
        <circle
          cx="20"
          cy="20"
          r="19"
          stroke={primaryStroke}
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
        <circle cx="20" cy="20" r="13" stroke={ringStroke} strokeWidth="1" />
        <path d="M20 3 L23.5 17 L20 20 L16.5 17 Z" fill="#176B70" />
        <path
          d="M20 37 L23.5 23 L20 20 L16.5 23 Z"
          fill="#53636E"
          fillOpacity="0.7"
        />
        <path
          d="M37 20 L23 23.5 L20 20 L23 16.5 Z"
          fill="#53636E"
          fillOpacity="0.4"
        />
        <path
          d="M3 20 L17 23.5 L20 20 L17 16.5 Z"
          fill="#53636E"
          fillOpacity="0.4"
        />
        <circle cx="20" cy="20" r="2" fill={primaryFill} />
        <path
          d="M20 0.5 L20.8 2.2 L22.5 3 L20.8 3.8 L20 5.5 L19.2 3.8 L17.5 3 L19.2 2.2 Z"
          fill="#176B70"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* North-point cartographic emblem */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-9 h-9 shrink-0"
      >
        <circle
          cx="20"
          cy="20"
          r="19"
          stroke={primaryStroke}
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
        <circle cx="20" cy="20" r="13" stroke={ringStroke} strokeWidth="1" />
        <path d="M20 3 L23.5 17 L20 20 L16.5 17 Z" fill="#176B70" />
        <path
          d="M20 37 L23.5 23 L20 20 L16.5 23 Z"
          fill="#53636E"
          fillOpacity="0.7"
        />
        <path
          d="M37 20 L23 23.5 L20 20 L23 16.5 Z"
          fill="#53636E"
          fillOpacity="0.4"
        />
        <path
          d="M3 20 L17 23.5 L20 20 L17 16.5 Z"
          fill="#53636E"
          fillOpacity="0.4"
        />
        <circle cx="20" cy="20" r="2" fill={primaryFill} />
        <path
          d="M20 0.5 L20.8 2.2 L22.5 3 L20.8 3.8 L20 5.5 L19.2 3.8 L17.5 3 L19.2 2.2 Z"
          fill="#176B70"
        />
      </svg>
      <div className="flex flex-col">
        <span
          className={`font-sans text-[17px] font-bold tracking-tight leading-tight ${
            isDark ? "text-white" : "text-expedition-ink"
          }`}
        >
          Dhruv Atlas
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest uppercase font-medium -mt-0.5 ${
            isDark ? "text-[#DCE3E7]" : "text-slate"
          }`}
        >
          {variant === "compact"
            ? "Cryosphere Node"
            : "Polar Research & Archive · by g-SAP"}
        </span>
      </div>
    </div>
  );
}
