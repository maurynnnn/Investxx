import { useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string;
  isPositive?: boolean;
}

interface SummaryCardProps {
  title: string;
  icon: string;
  amount: number;
  isPositive?: boolean;
  details: DetailItem[];
}

export default function SummaryCard({ 
  title, 
  icon, 
  amount, 
  isPositive = false, 
  details 
}: SummaryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="backdrop-blur-md bg-dark-card/75 border-dark-border p-5 card-hover-effect overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} 
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-light-subtext">{title}</h2>
          <div className={`w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            <i className={`${icon} text-primary text-lg`}></i>
          </div>
        </div>
        <div className="mt-3 flex items-baseline transform transition-all duration-300">
          <p className={`text-2xl font-semibold ${isPositive ? 'text-positive' : 'text-light-text'}`}>
            {formatCurrency(amount)}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          {details.map((detail, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between text-sm"
              style={{ 
                transition: 'all 0.3s ease', 
                transitionDelay: `${index * 50}ms`,
                transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
              }}
            >
              <span className="text-light-subtext">{detail.label}</span>
              <span className={`font-medium ${detail.isPositive ? 'text-positive' : 'text-light-text'}`}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
