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
import { Plan, Transaction, Investment, User } from "@shared/schema";

// Definindo a interface para o objeto do Dashboard
interface DashboardData {
  balance: number;
  activeInvestments: (Investment & { plan: Plan })[];
  transactions: Transaction[];
  totalYield: number;
  totalCommissions: number;
  referrals: { id: number; referred: User }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    staleTime: 60000, // 1 minute
  });

  const { data: plans } = useQuery<Plan[]>({
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

  // Mensagens motivacionais
  const motivationalMessages = [
    "O sucesso financeiro não é um destino, é uma jornada. Continue investindo!",
    "Grandes investidores não nasceram assim, eles se construíram diariamente.",
    "Cada investimento de hoje é um passo em direção ao seu futuro financeiro.",
    "Paciência e persistência são os pilares da riqueza.",
    "Investir cedo e com sabedoria é a fórmula do crescimento financeiro.",
    "Transforme seus sonhos em metas e suas metas em ações de investimento."
  ];
  
  // Selecionar mensagem de forma determinística com base no id do usuário
  const userIdNumber = user?.id ? Number(user.id) % motivationalMessages.length : 0;
  const todayMotivation = motivationalMessages[userIdNumber];

  // Verificar se é manhã, tarde ou noite para saudação personalizada
  const currentHour = new Date().getHours();
  let greeting = "Olá";
  
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Bom dia";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Boa tarde";
  } else {
    greeting = "Boa noite";
  }

  return (
    <MainLayout>
      {/* Dashboard Header com animação */}
      <div className="rounded-xl p-6 mb-6 bg-gradient-to-r from-dark-surface/80 to-dark-surface/30 border border-dark-border backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display font-bold text-light-text sm:text-3xl animate-fadeIn">
              {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{user?.firstName || "Investidor"}</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl animate-slideUp opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <span className="italic">"</span>{todayMotivation}<span className="italic">"</span>
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={navigateToInvestments} 
              className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Investir
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Saldo Disponível"
          icon="ri-wallet-3-line"
          amount={dashboardData?.balance ?? 0}
          details={[
            { label: "Depósitos", value: "R$ -" },
            { label: "Saques", value: "R$ -" }
          ]}
        />

        <SummaryCard
          title="Investimentos Ativos"
          icon="ri-funds-line"
          amount={dashboardData?.activeInvestments?.reduce((total, investment) => 
            total + investment.amount, 0) ?? 0}
          details={[
            { label: "Planos", value: `${dashboardData?.activeInvestments?.length ?? 0} Ativos` },
            { 
              label: "Rendimento Diário", 
              value: formatCurrency(dashboardData?.activeInvestments?.reduce((total, investment) => 
                total + (investment.amount * investment.plan.dailyInterestRate), 0) ?? 0),
              isPositive: true
            }
          ]}
        />

        <SummaryCard
          title="Rendimentos Totais"
          icon="ri-line-chart-line"
          amount={dashboardData?.totalYield ?? 0}
          isPositive={true}
          details={[
            { label: "Este mês", value: "R$ -", isPositive: true },
            { label: "Última semana", value: "R$ -", isPositive: true }
          ]}
        />

        <SummaryCard
          title="Comissões por Indicação"
          icon="ri-user-add-line"
          amount={dashboardData?.totalCommissions ?? 0}
          details={[
            { label: "Indicações", value: `${dashboardData?.referrals?.length ?? 0} pessoas` },
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
            investments={
              dashboardData?.activeInvestments?.map(investment => ({
                ...investment,
                startDate: typeof investment.startDate === 'string' 
                  ? investment.startDate 
                  : (investment.startDate as Date).toISOString()
              })) ?? []
            } 
            onViewAll={() => navigate("/investments")} 
          />
        </div>
        <div>
          <TransactionHistory 
            transactions={
              dashboardData?.transactions?.map(transaction => ({
                ...transaction,
                createdAt: typeof transaction.createdAt === 'string' 
                  ? transaction.createdAt 
                  : (transaction.createdAt as Date).toISOString()
              })) ?? []
            } 
            onViewAll={() => navigate("/transactions")} 
          />
        </div>
      </div>
    </MainLayout>
  );
}
