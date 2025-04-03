
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { formatCurrency } from "../../lib/utils";

export default function AdminTransactions() {
  const { data: transactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
    placeholderData: [
      { id: 1, user: "user1", type: "deposit", amount: 1000, status: "completed", date: "2024-01-20" },
      { id: 2, user: "user2", type: "withdrawal", amount: 500, status: "pending", date: "2024-01-19" },
    ]
  });

  return (
    <AdminLayout title="Transações" subtitle="Histórico de transações da plataforma">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(transactions || []).map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.user}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>{transaction.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
}
