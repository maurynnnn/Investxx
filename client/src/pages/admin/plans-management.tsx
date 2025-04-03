import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";

export default function PlansManagement() {
  const { data: plans } = useQuery({
    queryKey: ["/api/admin/plans"],
    placeholderData: [
      { id: 1, name: "Básico", minAmount: 100, maxAmount: 1000, returnRate: "5-10%", duration: "30 dias" },
      { id: 2, name: "Avançado", minAmount: 1000, maxAmount: 10000, returnRate: "10-15%", duration: "60 dias" },
    ]
  });

  const { toast } = useToast();

  return (
    <AdminLayout title="Gerenciamento de Planos" subtitle="Gerencie os planos de investimento">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Planos de Investimento</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Plano</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Nome do Plano" />
                <Input type="number" placeholder="Valor Mínimo" />
                <Input type="number" placeholder="Valor Máximo" />
                <Input placeholder="Taxa de Retorno (%)" />
                <Input placeholder="Duração (dias)" />
                <Textarea placeholder="Descrição do plano" />
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Plano criado",
                    description: "O plano foi criado com sucesso"
                  });
                }}>
                  Criar Plano
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable 
          data={plans || []}
          columns={[
            { header: "ID", accessorKey: "id" },
            { header: "Nome", accessorKey: "name" },
            { header: "Mín", accessorKey: "minAmount" },
            { header: "Máx", accessorKey: "maxAmount" },
            { header: "Retorno", accessorKey: "returnRate" },
            { header: "Duração", accessorKey: "duration" },
            { 
              header: "Ações",
              cell: () => (
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm" className="text-negative">Remover</Button>
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
}