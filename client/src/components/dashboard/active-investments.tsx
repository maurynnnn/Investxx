import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage, calculateProgressPercentage } from "@/lib/utils";

interface InvestmentWithPlan {
  id: number;
  amount: number;
  startDate: string;
  isActive: boolean;
  plan: {
    id: number;
    name: string;
    icon: string;
    dailyInterestRate: number;
    minimumInvestment: number;
  };
}

interface ActiveInvestmentsProps {
  investments: InvestmentWithPlan[];
  onViewAll: () => void;
}

export default function ActiveInvestments({ investments, onViewAll }: ActiveInvestmentsProps) {
  if (!investments || investments.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-display font-medium">Investimentos Ativos</CardTitle>
          <Button 
            variant="link" 
            onClick={onViewAll} 
            className="text-secondary hover:text-secondary/80 text-sm font-medium"
          >
            Ver todos
            <i className="ri-arrow-right-line ml-1"></i>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <i className="ri-funds-line text-primary text-xl"></i>
            </div>
            <h3 className="text-sm font-medium text-light-text mb-1">Nenhum investimento ativo</h3>
            <p className="text-xs text-light-subtext">
              Comece a investir para ver seus investimentos aqui
            </p>
            <Button onClick={onViewAll} className="mt-4 bg-primary hover:bg-primary/90">
              Investir Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display font-medium">Investimentos Ativos</CardTitle>
        <Button 
          variant="link" 
          onClick={onViewAll} 
          className="text-secondary hover:text-secondary/80 text-sm font-medium"
        >
          Ver todos
          <i className="ri-arrow-right-line ml-1"></i>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.slice(0, 3).map((investment) => {
            const dailyYield = investment.amount * investment.plan.dailyInterestRate;
            const startDate = new Date(investment.startDate);
            const progressPercentage = calculateProgressPercentage(startDate, 30);
            const daysRemaining = 30 - Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={investment.id} 
                className="bg-dark-surface border border-dark-border p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <i className={`${investment.plan.icon} text-primary`}></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-light-text">
                        Plano {investment.plan.name}
                      </h3>
                      <p className="text-xs text-light-subtext">
                        Rendimento: {formatPercentage(investment.plan.dailyInterestRate)} ao dia
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-light-text">
                      {formatCurrency(investment.amount)}
                    </p>
                    <p className="text-xs text-positive">
                      +{formatCurrency(dailyYield)}/dia
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-light-subtext">{daysRemaining} dias restantes</span>
                    <span className="text-light-subtext">Bônus em: {daysRemaining} dias</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {investments.length > 3 && (
            <div className="text-center pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewAll}
                className="border-dark-border text-light-subtext hover:text-light-text"
              >
                Ver mais {investments.length - 3} investimentos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
