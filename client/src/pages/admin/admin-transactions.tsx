
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Download, Filter, Loader2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  const filteredTransactions = transactions.filter((transaction: any) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.userId.toString().includes(searchTerm)
  );

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-red-500';
      case 'investment':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Transações" subtitle="Gerenciamento de transações">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Transações" subtitle="Gerenciamento de transações">
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtext" />
                <Input
                  type="search"
                  placeholder="Buscar transações..."
                  className="w-full pl-9 bg-dark-surface border-dark-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-1 border-dark-border text-light-subtext">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-1 border-dark-border text-light-subtext">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-dark-border">
              <Table>
                <TableHeader className="bg-dark-surface">
                  <TableRow className="hover:bg-transparent border-dark-border">
                    <TableHead className="text-light-subtext">ID</TableHead>
                    <TableHead className="text-light-subtext">Usuário ID</TableHead>
                    <TableHead className="text-light-subtext">Tipo</TableHead>
                    <TableHead className="text-light-subtext">Valor</TableHead>
                    <TableHead className="text-light-subtext">Descrição</TableHead>
                    <TableHead className="text-light-subtext">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction: any) => (
                    <TableRow key={transaction.id} className="hover:bg-dark-surface/50 border-dark-border">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.userId}</TableCell>
                      <TableCell>
                        <span className={getStatusColor(transaction.type)}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
