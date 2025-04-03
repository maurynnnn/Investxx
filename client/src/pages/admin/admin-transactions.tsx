
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/ui/table";
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
      <DataTable 
        data={transactions || []}
        columns={[
          { header: "ID", accessorKey: "id" },
          { header: "Usuário", accessorKey: "user" },
          { header: "Tipo", accessorKey: "type" },
          { 
            header: "Valor", 
            accessorKey: "amount",
            cell: ({ row }) => formatCurrency(row.original.amount)
          },
          { header: "Status", accessorKey: "status" },
          { header: "Data", accessorKey: "date" }
        ]}
      />
    </AdminLayout>
  );
}
