import { useEffect, useState } from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
}

export default function Logo({ size = "medium", withText = true }: LogoProps) {
  const [animate, setAnimate] = useState(false);
  
  // Tamanho do texto com base no parâmetro
  const getTextSize = () => {
    switch(size) {
      case "small": return "text-lg";
      case "large": return "text-3xl";
      default: return "text-xl";
    }
  };
  
  // Efeito visual de pulsação que ocorre periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      {/* Texto "InvestX" animado */}
      <div 
        className={`font-display font-bold ${getTextSize()} bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 transition-transform duration-300 ${
          animate ? 'scale-110' : 'scale-100'
        }`}
      >
        Invest<span className="text-secondary">X</span>
      </div>
    </div>
  );
}