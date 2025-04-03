
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { formatCurrency } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals?.map((withdrawal) => (
              <TableRow key={withdrawal.id}>
                <TableCell>{withdrawal.id}</TableCell>
                <TableCell>{withdrawal.user}</TableCell>
                <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                <TableCell>{withdrawal.status}</TableCell>
                <TableCell>{withdrawal.date}</TableCell>
                <TableCell>{withdrawal.method}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-positive" onClick={() => {
                      toast({
                        title: "Saque aprovado",
                        description: "O saque foi aprovado com sucesso"
                      });
                    }}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-negative">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
