import { useEffect, useState } from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  withText?: boolean;
}

export default function Logo({ size = "medium", withText = true }: LogoProps) {
  const [animate, setAnimate] = useState(false);
  
  // Tamanho do logo com base no parâmetro
  const getSize = () => {
    switch(size) {
      case "small": return "w-6 h-6";
      case "large": return "w-12 h-12";
      default: return "w-8 h-8";
    }
  };
  
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
      <div className="relative">
        {/* Círculo animado de fundo */}
        <div 
          className={`absolute inset-0 rounded-full bg-primary/30 transform transition-all duration-500 ${
            animate ? 'scale-[1.5] opacity-0' : 'scale-100 opacity-100'
          }`} 
        />
        
        {/* Logo principal */}
        <div className={`${getSize()} relative rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
          <div className="absolute inset-0 rounded-full bg-dark-bg/20" />
          
          {/* Símbolo X em destaque */}
          <div className="relative z-10 font-bold text-white tracking-tighter transform transition-transform duration-300">
            <span className={`${size === "small" ? "text-lg" : size === "large" ? "text-3xl" : "text-xl"}`}>
              X
            </span>
          </div>
          
          {/* Partícula animada */}
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary animate-pulse`} />
        </div>
      </div>
      
      {/* Texto "InvestX" */}
      {withText && (
        <div className={`ml-2 font-display font-bold ${getTextSize()} bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80`}>
          Invest<span className="text-secondary">X</span>
        </div>
      )}
    </div>
  );
}