import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Users, ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";

interface AdminSummary {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  pendingWithdrawals: number;
  recentUsers: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
  }[];
  recentTransactions: {
    id: number;
    type: string;
    amount: number;
    userId: number;
    username: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const { data: adminSummary, isLoading } = useQuery<AdminSummary>({
    queryKey: ["/api/admin/summary"],
    // Mocked data since we're not implementing the backend yet
    placeholderData: {
      totalUsers: 124,
      totalDeposits: 487500,
      totalWithdrawals: 156200,
      totalInvestments: 356000,
      pendingWithdrawals: 12,
      recentUsers: [
        { id: 1, username: "maurosa", email: "mauro@example.com", createdAt: "2023-05-12T00:00:00.000Z" },
        { id: 2, username: "investor2023", email: "investor@example.com", createdAt: "2023-05-11T00:00:00.000Z" },
        { id: 3, username: "financial_guru", email: "guru@example.com", createdAt: "2023-05-10T00:00:00.000Z" },
        { id: 4, username: "money_maker", email: "money@example.com", createdAt: "2023-05-09T00:00:00.000Z" },
        { id: 5, username: "wealth_builder", email: "wealth@example.com", createdAt: "2023-05-08T00:00:00.000Z" },
      ],
      recentTransactions: [
        { id: 1, type: "deposit", amount: 1000, userId: 1, username: "maurosa", createdAt: "2023-05-12T00:00:00.000Z" },
        { id: 2, type: "withdrawal", amount: 500, userId: 2, username: "investor2023", createdAt: "2023-05-11T00:00:00.000Z" },
        { id: 3, type: "investment", amount: 2000, userId: 3, username: "financial_guru", createdAt: "2023-05-10T00:00:00.000Z" },
        { id: 4, type: "yield", amount: 150, userId: 4, username: "money_maker", createdAt: "2023-05-09T00:00:00.000Z" },
        { id: 5, type: "commission", amount: 75, userId: 5, username: "wealth_builder", createdAt: "2023-05-08T00:00:00.000Z" },
      ],
    },
  });

  if (isLoading) {
    return (
      <AdminLayout title="Painel Administrativo" subtitle="Visão geral da plataforma">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Painel Administrativo" subtitle="Visão geral da plataforma">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-card-bg border-card-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Usuários
            </CardTitle>
            <CardDescription>Total de contas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-light-text">{adminSummary?.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-card-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-positive" />
              Depósitos
            </CardTitle>
            <CardDescription>Total em depósitos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-light-text">
              {formatCurrency(adminSummary?.totalDeposits || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-card-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-negative" />
              Saques
            </CardTitle>
            <CardDescription>Total em saques</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-light-text">
              {formatCurrency(adminSummary?.totalWithdrawals || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-card-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Saques Pendentes
            </CardTitle>
            <CardDescription>Aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-light-text">{adminSummary?.pendingWithdrawals}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Usuários Recentes</CardTitle>
            <CardDescription>Últimas contas criadas na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {adminSummary?.recentUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center border-b border-dark-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-light-text">{user.username}</p>
                    <p className="text-sm text-light-subtext">{user.email}</p>
                  </div>
                  <div className="text-sm text-light-subtext">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Transações Recentes</CardTitle>
            <CardDescription>Últimas movimentações na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {adminSummary?.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center border-b border-dark-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-light-text capitalize">{transaction.type}</p>
                    <p className="text-sm text-light-subtext">{transaction.username}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === "deposit" || transaction.type === "yield" || transaction.type === "commission" 
                        ? "text-positive" 
                        : transaction.type === "withdrawal" 
                          ? "text-negative" 
                          : "text-primary"
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-light-subtext">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}