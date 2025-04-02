import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Loader2, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Copy,
  GanttChartSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";

export default function AdminPlansPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // TODO: Substituir por consulta real
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/admin/plans"],
    queryFn: () => {
      // Dados simulados
      return [
        {
          id: 1,
          name: "Iniciante",
          icon: "ri-seedling-line",
          description: "Plano ideal para quem está começando a investir. Baixo investimento inicial e retornos consistentes.",
          minimumInvestment: 1000,
          dailyInterestRate: 0.5,
          features: [
            "Rendimento diário",
            "Suporte básico",
            "Acesso à comunidade",
            "Relatórios mensais"
          ],
          isActive: true
        },
        {
          id: 2,
          name: "Intermediário",
          icon: "ri-plant-line",
          description: "Para investidores que desejam aumentar seus retornos com taxas de juros mais atrativas.",
          minimumInvestment: 5000,
          dailyInterestRate: 0.75,
          features: [
            "Rendimento diário",
            "Suporte prioritário",
            "Acesso à comunidade VIP",
            "Relatórios semanais",
            "Consultorias mensais"
          ],
          isActive: true
        },
        {
          id: 3,
          name: "Avançado",
          icon: "ri-tree-line",
          description: "Para investidores experientes que buscam maximizar seus rendimentos com taxas premium.",
          minimumInvestment: 10000,
          dailyInterestRate: 1,
          features: [
            "Rendimento diário",
            "Suporte VIP 24/7",
            "Acesso à comunidade exclusiva",
            "Relatórios detalhados",
            "Consultorias semanais",
            "Bônus de fidelidade mensal"
          ],
          isActive: true
        },
        {
          id: 4,
          name: "Premium",
          icon: "ri-vip-crown-line",
          description: "Nosso plano mais exclusivo. Taxas de retorno máximas e benefícios únicos para grandes investidores.",
          minimumInvestment: 25000,
          dailyInterestRate: 1.25,
          features: [
            "Rendimento diário",
            "Suporte exclusivo com gerente dedicado",
            "Comunidade restrita de investidores",
            "Relatórios em tempo real",
            "Consultorias ilimitadas",
            "Bônus de fidelidade semanal",
            "Acesso antecipado a novos produtos"
          ],
          isActive: false
        }
      ];
    },
    staleTime: 2 * 60 * 1000 // 2 minutos
  });
  
  const form = useForm({
    defaultValues: {
      name: "",
      icon: "",
      description: "",
      minimumInvestment: 1000,
      dailyInterestRate: 0.5,
      features: "",
      isActive: true
    }
  });
  
  function onSubmit(values) {
    console.log(values);
    setIsDialogOpen(false);
  }
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-background p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Acesso não autorizado</h2>
        <p className="text-light-subtext mb-6">Você não tem permissão para acessar esta área.</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <AdminLayout
      title="Gerenciar Planos de Investimento"
      subtitle="Configure os planos de investimento disponíveis na plataforma"
    >
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-dark-card border-dark-border">
            <DialogHeader>
              <DialogTitle className="text-light-text">Adicionar Novo Plano</DialogTitle>
              <DialogDescription className="text-light-subtext">
                Preencha os detalhes do novo plano de investimento que será disponibilizado aos usuários.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light-text">Nome do Plano</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-surface border-dark-border text-light-text" 
                        />
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
                      <FormLabel className="text-light-text">Ícone (classe CSS)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-surface border-dark-border text-light-text" 
                          placeholder="ex: ri-seedling-line"
                        />
                      </FormControl>
                      <FormDescription className="text-light-subtext text-xs">
                        Use ícones da biblioteca Remix Icon (prefixo ri-).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light-text">Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-dark-surface border-dark-border text-light-text resize-none h-20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minimumInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-light-text">Investimento Mínimo (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="bg-dark-surface border-dark-border text-light-text" 
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
                        <FormLabel className="text-light-text">Taxa Diária (%)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            step="0.01"
                            className="bg-dark-surface border-dark-border text-light-text" 
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
                      <FormLabel className="text-light-text">Funcionalidades</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-dark-surface border-dark-border text-light-text resize-none h-20" 
                          placeholder="Liste os benefícios, um por linha"
                        />
                      </FormControl>
                      <FormDescription className="text-light-subtext text-xs">
                        Insira cada funcionalidade em uma linha separada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border border-dark-border p-4 bg-dark-surface">
                      <div className="space-y-0.5">
                        <FormLabel className="text-light-text">Plano Ativo</FormLabel>
                        <FormDescription className="text-light-subtext text-xs">
                          Se desativado, o plano não será exibido para novos investidores.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-dark-border text-light-text hover:bg-dark-surface"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Salvar Plano
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card key={plan.id} className={`bg-dark-card border-dark-border ${!plan.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <GanttChartSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-light-text">{plan.name}</h3>
                      <p className="text-sm text-light-subtext">Plano #{plan.id}</p>
                    </div>
                  </div>
                  
                  <div>
                    {plan.isActive ? (
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/20 text-destructive hover:bg-destructive/30 border-none">
                        Inativo
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-light-subtext mb-4 text-sm">
                  {plan.description}
                </p>
                
                <div className="flex flex-col space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-light-subtext text-sm">Investimento mínimo:</span>
                    <span className="text-light-text font-medium">
                      {formatCurrency(plan.minimumInvestment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-light-subtext text-sm">Taxa diária:</span>
                    <span className="text-primary font-medium">
                      {plan.dailyInterestRate}% ao dia
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-light-subtext text-sm">Rentabilidade mensal:</span>
                    <span className="text-light-text font-medium">
                      ~{(plan.dailyInterestRate * 30).toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-dark-border pt-4">
                  <p className="text-light-subtext mb-2 text-sm font-medium">Benefícios</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-light-text text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="px-6 py-4 border-t border-dark-border flex justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-dark-border text-light-text hover:bg-dark-surface"
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-dark-border text-light-text hover:bg-dark-surface"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}