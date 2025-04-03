
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { formatCurrency, formatDate } from "../../lib/utils";

interface Transaction {
  id: number;
  userId: number;
  username: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function AdminTransactions() {
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    refetchInterval: 5000 // Refetch every 5 seconds
  });

  return (
    <AdminLayout title="Transações" subtitle="Gerencie todas as transações do sistema">
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.username}</TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell className={
                  transaction.type === "deposit" || transaction.type === "yield" || transaction.type === "commission"
                    ? "text-positive"
                    : transaction.type === "withdrawal"
                      ? "text-negative"
                      : ""
                }>
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatDate(new Date(transaction.createdAt))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
