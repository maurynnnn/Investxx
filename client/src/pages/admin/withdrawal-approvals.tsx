import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

export default function WithdrawalApprovals() {
  const { data: withdrawals } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
    placeholderData: [
      { id: 1, user: "user1", amount: 1000, status: "pending", date: "2024-01-20", method: "PIX" },
      { id: 2, user: "user2", amount: 500, status: "pending", date: "2024-01-19", method: "Bank Transfer" },
    ]
  });

  const { toast } = useToast();

  return (
    <AdminLayout title="Aprovação de Saques" subtitle="Gerencie as solicitações de saque">
      <div className="space-y-4">
        <DataTable 
          data={withdrawals || []}
          columns={[
            { header: "ID", accessorKey: "id" },
            { header: "Usuário", accessorKey: "user" },
            { header: "Valor", accessorKey: "amount" },
            { header: "Status", accessorKey: "status" },
            { header: "Data", accessorKey: "date" },
            { header: "Método", accessorKey: "method" },
            { 
              header: "Ações",
              cell: () => (
                <div className="space-x-2">
                  <Button variant="outline" size="sm" className="text-positive" onClick={() => {
                    toast({
                      title: "Saque aprovado",
                      description: "O saque foi aprovado com sucesso"
                    });
                  }}>Aprovar</Button>
                  <Button variant="outline" size="sm" className="text-negative">Rejeitar</Button>
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
}