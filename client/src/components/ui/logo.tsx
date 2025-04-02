import { useEffect, useState } from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
}

export default function Logo({ size = "medium", withText = true }: LogoProps) {
  const getTextSize = () => {
    switch(size) {
      case "small": return "text-lg";
      case "large": return "text-3xl";
      default: return "text-xl";
    }
  };

  return (
    <div className="flex items-center">
      {withText && (
        <div className={`font-display font-bold ${getTextSize()} bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform duration-300`}>
          Invest<span className="text-secondary animate-pulse">X</span>
        </div>
      )}
    </div>
  );
}