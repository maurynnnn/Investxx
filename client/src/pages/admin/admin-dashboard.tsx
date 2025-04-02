import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, Wallet, HelpCircle, LineChart, Activity, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // TODO: Substituir por consultas reais quando as APIs estiverem prontas
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => {
      // Dados simulados para visualização
      return {
        usersCount: 156,
        activeInvestmentsCount: 248,
        totalInvestedAmount: 1750000,
        pendingWithdrawalsCount: 12,
        dailyTransactionsCount: 45,
        monthlySummary: [
          { month: "Jan", investments: 120000, withdrawals: 75000 },
          { month: "Feb", investments: 145000, withdrawals: 82000 },
          { month: "Mar", investments: 180000, withdrawals: 95000 },
          { month: "Apr", investments: 210000, withdrawals: 110000 },
          { month: "May", investments: 190000, withdrawals: 105000 },
          { month: "Jun", investments: 225000, withdrawals: 115000 },
        ]
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-background p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Acesso não autorizado</h2>
        <p className="text-light-subtext mb-6">Você não tem permissão para acessar esta área.</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  return (
    <AdminLayout 
      title="Visão Geral"
      subtitle="Monitore todos os aspectos da plataforma em um só lugar"
    >
      <div className="space-y-6">
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-dark-card hover:bg-dark-card/90 border-dark-border transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-light-subtext">
                    Usuários Registrados
                  </CardTitle>
                  <Users className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-light-text">{stats?.usersCount || 0}</div>
                  <p className="text-xs text-light-subtext mt-1">+12 na última semana</p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-card hover:bg-dark-card/90 border-dark-border transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-light-subtext">
                    Investimentos Ativos
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-light-text">{stats?.activeInvestmentsCount || 0}</div>
                  <p className="text-xs text-light-subtext mt-1">+23 desde o último mês</p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-card hover:bg-dark-card/90 border-dark-border transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-light-subtext">
                    Total Investido
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-light-text">
                    {formatCurrency(stats?.totalInvestedAmount || 0)}
                  </div>
                  <p className="text-xs text-light-subtext mt-1">+5.2% desde o último mês</p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-card hover:bg-dark-card/90 border-dark-border transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-light-subtext">
                    Saques Pendentes
                  </CardTitle>
                  <Activity className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-light-text">{stats?.pendingWithdrawalsCount || 0}</div>
                  <p className="text-xs text-light-subtext mt-1">Necessitam aprovação</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-dark-card border-dark-border">
                <CardHeader>
                  <CardTitle>Movimentações Mensais</CardTitle>
                  <CardDescription>
                    Comparativo entre investimentos e saques
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full">
                    <HelpCircle className="h-10 w-10 text-secondary/50" />
                    <p className="ml-2 text-light-subtext">Gráfico de barras será exibido aqui</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-card border-dark-border">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>
                    Últimas operações no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-dark-border pb-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text">Novo investimento criado</p>
                        <p className="text-xs text-light-subtext">Usuário #123 - Plano Premium - R$ 15.000</p>
                      </div>
                      <div className="text-xs text-light-subtext">Há 2h</div>
                    </div>
                    
                    <div className="flex items-center gap-4 border-b border-dark-border pb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text">Solicitação de saque</p>
                        <p className="text-xs text-light-subtext">Usuário #78 - R$ 5.400</p>
                      </div>
                      <div className="text-xs text-light-subtext">Há 4h</div>
                    </div>
                    
                    <div className="flex items-center gap-4 border-b border-dark-border pb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text">Novo usuário registrado</p>
                        <p className="text-xs text-light-subtext">Referido por: Usuário #45</p>
                      </div>
                      <div className="text-xs text-light-subtext">Há 6h</div>
                    </div>
                    
                    <div className="flex items-center gap-4 pb-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-light-text">Rendimentos distribuídos</p>
                        <p className="text-xs text-light-subtext">45 investimentos - Total: R$ 12.450</p>
                      </div>
                      <div className="text-xs text-light-subtext">Há 12h</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}