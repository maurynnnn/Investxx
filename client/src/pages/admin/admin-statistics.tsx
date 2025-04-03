
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function AdminStatistics() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["/api/admin/statistics"],
    placeholderData: {
      totalTransactions: 0,
      averageInvestment: 0,
      activeInvestments: 0,
      completedInvestments: 0
    }
  });

  if (isLoading) {
    return (
      <AdminLayout title="Estatísticas" subtitle="Análise detalhada da plataforma">
        <div>Carregando...</div>
      </AdminLayout>
    );
  }

  if (!statistics) {
    return (
      <AdminLayout title="Estatísticas" subtitle="Análise detalhada da plataforma">
        <div>Nenhuma estatística disponível</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Estatísticas" subtitle="Análise detalhada da plataforma">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {statistics.averageInvestment}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.activeInvestments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completedInvestments}</div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
