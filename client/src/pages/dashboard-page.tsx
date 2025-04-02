import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import SummaryCard from "@/components/dashboard/summary-card";
import InvestmentChart from "@/components/dashboard/investment-chart";
import ActiveInvestments from "@/components/dashboard/active-investments";
import TransactionHistory from "@/components/dashboard/transaction-history";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    staleTime: 60000, // 1 minute
  });

  const { data: plans } = useQuery({
    queryKey: ["/api/plans"],
  });

  const navigateToInvestments = () => {
    navigate("/investments");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Current date formatting
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Last login formatting
  const lastLogin = user?.lastLogin ? new Date(user.lastLogin) : null;
  const formattedLastLogin = lastLogin ? formatDate(lastLogin, { 
    hour: 'numeric', 
    minute: '2-digit'
  }) : 'N/A';

  return (
    <MainLayout>
      {/* Dashboard Header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-display font-bold text-light-text sm:text-3xl">
            Olá, <span className="text-primary">{user?.firstName || "Investidor"}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {formattedDate} • Último login: {formattedLastLogin}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button onClick={navigateToInvestments} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Investir
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Saldo Disponível"
          icon="ri-wallet-3-line"
          amount={dashboardData?.balance || 0}
          details={[
            { label: "Depósitos", value: "R$ -" },
            { label: "Saques", value: "R$ -" }
          ]}
        />

        <SummaryCard
          title="Investimentos Ativos"
          icon="ri-funds-line"
          amount={dashboardData?.activeInvestments?.reduce((total: number, investment: any) => total + investment.amount, 0) || 0}
          details={[
            { label: "Planos", value: `${dashboardData?.activeInvestments?.length || 0} Ativos` },
            { 
              label: "Rendimento Diário", 
              value: formatCurrency(dashboardData?.activeInvestments?.reduce((total: number, investment: any) => 
                total + (investment.amount * investment.plan.dailyInterestRate), 0) || 0),
              isPositive: true
            }
          ]}
        />

        <SummaryCard
          title="Rendimentos Totais"
          icon="ri-line-chart-line"
          amount={dashboardData?.totalYield || 0}
          isPositive={true}
          details={[
            { label: "Este mês", value: "R$ -", isPositive: true },
            { label: "Última semana", value: "R$ -", isPositive: true }
          ]}
        />

        <SummaryCard
          title="Comissões por Indicação"
          icon="ri-user-add-line"
          amount={dashboardData?.totalCommissions || 0}
          details={[
            { label: "Indicações", value: `${dashboardData?.referrals?.length || 0} pessoas` },
            { label: "Última comissão", value: "R$ -", isPositive: true }
          ]}
        />
      </div>

      {/* Investment Performance Chart */}
      <div className="mt-8">
        <InvestmentChart />
      </div>

      {/* Active Investment Plans and Transaction History */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveInvestments 
            investments={dashboardData?.activeInvestments || []} 
            onViewAll={() => navigate("/investments")} 
          />
        </div>
        <div>
          <TransactionHistory 
            transactions={dashboardData?.transactions || []} 
            onViewAll={() => navigate("/transactions")} 
          />
        </div>
      </div>
    </MainLayout>
  );
}
