import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface InvestmentPlanProps {
  plan: {
    id: number;
    name: string;
    description: string;
    minimumInvestment: number;
    dailyInterestRate: number;
    features: string[];
    icon: string;
  };
  onInvestClick: () => void;
}

export default function InvestmentPlanCard({ plan, onInvestClick }: InvestmentPlanProps) {
  // Calculate gradient opacity based on plan level
  const getGradientStyle = () => {
    const plans = ["Básico", "Intermediário", "Avançado", "Premium", "Master"];
    const index = plans.indexOf(plan.name);
    
    // For Master plan (highest tier), use full gradient
    if (plan.name === "Master") {
      return {
        cardClass: "border-primary/30 hover:shadow-glow hover:border-primary",
        headerClass: "bg-gradient-to-r from-primary to-secondary"
      };
    }
    
    // For other plans, use increasingly opaque gradients
    const opacity = 0.2 + (index * 0.15);
    return {
      cardClass: "",
      headerClass: `bg-primary/${Math.round(opacity * 100)}`
    };
  };
  
  const { cardClass, headerClass } = getGradientStyle();

  return (
    <Card className={`backdrop-blur-md bg-dark-card/75 border-dark-border shadow hover:shadow-glow transition-all duration-300 ${cardClass}`}>
      <div className={`rounded-t-xl p-4 ${headerClass}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-white font-display font-semibold">{plan.name}</h3>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <i className={`${plan.icon} text-white`}></i>
          </div>
        </div>
        <p className="mt-2 text-white/80 text-sm">{plan.description}</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-baseline mb-1">
            <span className="text-2xl font-bold text-light-text">
              {formatPercentage(plan.dailyInterestRate)}
            </span>
            <span className="text-light-subtext text-sm ml-1">ao dia</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-light-subtext">Mínimo:</span>
            <span className="text-sm font-medium text-light-text ml-1">
              {formatCurrency(plan.minimumInvestment)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <i className="ri-check-line text-positive mr-2"></i>
              <span className="text-sm text-light-text">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          onClick={onInvestClick}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Investir Agora
        </Button>
      </div>
    </Card>
  );
}
