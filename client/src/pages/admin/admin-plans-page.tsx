import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Plan, insertPlanSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency, formatPercentage } from "@/lib/utils";

// Schema para o formulário de plano
const planFormSchema = insertPlanSchema.extend({
  features: z.string().min(1, "Adicione pelo menos um recurso"),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

export default function AdminPlansPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Inicializar o formulário
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      icon: "chart-bar",
      description: "",
      minimumInvestment: 100,
      dailyInterestRate: 0.5,
      features: "Rendimento diário\nRetiradas a qualquer momento\nSuportem 24/7",
      isActive: true
    }
  });

  // Função para abrir o modal de edição
  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      icon: plan.icon,
      description: plan.description,
      minimumInvestment: plan.minimumInvestment,
      dailyInterestRate: plan.dailyInterestRate,
      features: plan.features.join("\n"),
      isActive: plan.isActive
    });
    setIsDialogOpen(true);
  };

  // Função para abrir o modal de criação
  const openCreateDialog = () => {
    setEditingPlan(null);
    form.reset({
      name: "",
      icon: "chart-bar",
      description: "",
      minimumInvestment: 100,
      dailyInterestRate: 0.5,
      features: "Rendimento diário\nRetiradas a qualquer momento\nSuportem 24/7",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  // Buscar planos de investimento
  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  // Mutação para criar/editar plano
  const planMutation = useMutation({
    mutationFn: async (data: PlanFormValues) => {
      // Converter features de string para array
      const planData = {
        ...data,
        features: data.features.split("\n").filter(feature => feature.trim() !== "")
      };

      let res;
      if (editingPlan) {
        res = await apiRequest("PATCH", `/api/admin/plans/${editingPlan.id}`, planData);
      } else {
        res = await apiRequest("POST", "/api/admin/plans", planData);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setIsDialogOpen(false);
      toast({
        title: editingPlan ? "Plano atualizado" : "Plano criado",
        description: editingPlan 
          ? `O plano ${form.getValues().name} foi atualizado com sucesso.` 
          : `O plano ${form.getValues().name} foi criado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    },
  });

  // Mutação para ativar/desativar plano
  const togglePlanMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/plans/${id}/toggle`, { isActive });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "Status atualizado",
        description: "O status do plano foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar o status do plano.",
        variant: "destructive",
      });
    },
  });

  // Mutação para excluir plano
  const deletePlanMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "Plano excluído",
        description: "O plano foi excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir o plano.",
        variant: "destructive",
      });
    },
  });

  // Handler para envio do formulário
  function onSubmit(values) {
    planMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Planos" subtitle="Crie e gerencie planos de investimento">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciamento de Planos" subtitle="Crie e gerencie planos de investimento">
      <div className="flex justify-end mb-6">
        <Button 
          onClick={openCreateDialog}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className={`bg-card-bg border-card-border overflow-hidden ${!plan.isActive ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                    onClick={() => openEditDialog(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-negative hover:text-negative/80 hover:bg-negative/10"
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o plano ${plan.name}?`)) {
                        deletePlanMutation.mutate(plan.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-light-subtext">Investimento mínimo:</span>
                  <span className="font-medium text-light-text">{formatCurrency(plan.minimumInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-subtext">Taxa de juros diária:</span>
                  <span className="font-medium text-positive">{formatPercentage(plan.dailyInterestRate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-subtext">Status:</span>
                  <span className={`font-medium ${plan.isActive ? 'text-positive' : 'text-negative'}`}>
                    {plan.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div className="border-t border-dark-border pt-3">
                <p className="text-sm font-medium mb-2 text-light-text">Recursos:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-light-subtext flex items-start">
                      <Check className="h-4 w-4 text-positive mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-dark-border pt-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={plan.isActive} 
                  onCheckedChange={(isActive) => {
                    togglePlanMutation.mutate({ id: plan.id, isActive });
                  }}
                />
                <span className="text-sm text-light-subtext">
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-sm font-medium text-light-subtext">ID: {plan.id}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Diálogo para criar/editar plano */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
            <DialogDescription>
              {editingPlan 
                ? "Atualize as informações do plano de investimento existente." 
                : "Preencha os campos abaixo para criar um novo plano de investimento."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Plano</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Básico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <FormControl>
                        <Input placeholder="chart-bar" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome do ícone do Lucide React
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição breve do plano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimumInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investimento Mínimo (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="50"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dailyInterestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Juros Diária (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recursos (um por linha)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={5}
                        placeholder="Liste os recursos do plano (um por linha)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adicione cada recurso em uma nova linha
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-dark-border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status do Plano</FormLabel>
                      <FormDescription>
                        Ativar ou desativar este plano para novos investimentos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={planMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {planMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {editingPlan ? "Salvar Alterações" : "Criar Plano"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}