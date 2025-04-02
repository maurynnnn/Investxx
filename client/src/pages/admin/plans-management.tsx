import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertTriangle, 
  PlusCircle, 
  Pencil, 
  Eye, 
  BarChart3, 
  Trash2, 
  MoreHorizontal,
  ToggleRight,
  ToggleLeft
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Dados simulados para visualização
const mockPlans = [
  {
    id: 1,
    name: "Iniciante",
    description: "Plano ideal para quem está começando a investir",
    minimumInvestment: 1000,
    dailyInterestRate: 0.25,
    features: ["Rendimento diário", "Saque disponível a qualquer momento", "Suporte básico"],
    icon: "ri-seedling-line",
    isActive: true
  },
  {
    id: 2,
    name: "Intermédio",
    description: "Plano com rendimentos melhores para investidores com experiência",
    minimumInvestment: 5000,
    dailyInterestRate: 0.35,
    features: ["Rendimento diário", "Saque disponível a qualquer momento", "Suporte prioritário", "Acesso a análises de mercado"],
    icon: "ri-plant-line",
    isActive: true
  },
  {
    id: 3,
    name: "Avançado",
    description: "Plano premium com os melhores rendimentos para investidores experientes",
    minimumInvestment: 10000,
    dailyInterestRate: 0.5,
    features: ["Rendimento diário", "Saque disponível a qualquer momento", "Suporte VIP 24/7", "Acesso a análises avançadas", "Consultoria personalizada"],
    icon: "ri-plant-fill",
    isActive: true
  },
  {
    id: 4,
    name: "Elite",
    description: "Plano exclusivo para grandes investidores com benefícios premium",
    minimumInvestment: 50000,
    dailyInterestRate: 0.75,
    features: ["Rendimento diário", "Saque prioritário", "Suporte VIP com gerente dedicado", "Análises avançadas exclusivas", "Consultoria financeira mensal", "Bônus de fidelidade"],
    icon: "ri-vip-crown-fill",
    isActive: true
  },
  {
    id: 5,
    name: "Promocional",
    description: "Plano promocional por tempo limitado",
    minimumInvestment: 2500,
    dailyInterestRate: 0.4,
    features: ["Rendimento diário", "Saque disponível a qualquer momento", "Bonificação especial", "Promoção por tempo limitado"],
    icon: "ri-gift-fill",
    isActive: false
  }
];

export default function PlansManagement() {
  const { user } = useAuth();
  const [plans, setPlans] = useState(mockPlans);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof mockPlans[0] | null>(null);

  const handleToggleStatus = (planId: number) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isActive: !plan.isActive } 
        : plan
    ));
  };
  
  const handleDelete = (plan: typeof mockPlans[0]) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // Aqui implementaríamos a chamada à API para excluir o plano
    setPlans(plans.filter(p => p.id !== selectedPlan?.id));
    setDeleteDialogOpen(false);
  };
  
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">Ativo</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-500">Inativo</Badge>;
  };
  
  const getFormattedRate = (rate: number) => {
    return `${rate.toFixed(2)}% ao dia`;
  };

  if (!user || user.role !== 'admin') {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-negative mb-4" />
          <h2 className="text-xl font-semibold text-negative">Acesso não autorizado</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAdmin={true}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-light-text">
              Gerenciamento de Planos
            </h1>
            <p className="text-light-subtext">
              Crie, edite e gerencie os planos de investimento disponíveis na plataforma.
            </p>
          </div>
          
          <Button className="bg-secondary hover:bg-secondary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Novo Plano
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="bg-dark-card border-dark-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Planos de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dark-border">
                <Table>
                  <TableHeader className="bg-dark-surface">
                    <TableRow className="hover:bg-transparent border-dark-border">
                      <TableHead className="text-light-subtext">ID</TableHead>
                      <TableHead className="text-light-subtext">Nome</TableHead>
                      <TableHead className="text-light-subtext hidden md:table-cell">Descrição</TableHead>
                      <TableHead className="text-light-subtext">Investimento Mínimo</TableHead>
                      <TableHead className="text-light-subtext">Taxa de Rendimento</TableHead>
                      <TableHead className="text-light-subtext">Status</TableHead>
                      <TableHead className="text-light-subtext text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan.id} className="hover:bg-dark-surface/50 border-dark-border">
                        <TableCell className="font-medium text-light-text">{plan.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary/70 text-white flex items-center justify-center">
                              <i className={`${plan.icon} text-lg`}></i>
                            </div>
                            <span className="text-sm font-medium text-light-text">{plan.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate hidden md:table-cell">
                          <span className="text-sm text-light-text">{plan.description}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-light-text">R$ {plan.minimumInvestment.toLocaleString('pt-BR')}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-light-text">{getFormattedRate(plan.dailyInterestRate)}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(plan.isActive)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-dark-card border-dark-border">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-dark-border" />
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar Plano
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleToggleStatus(plan.id)}
                              >
                                {plan.isActive ? (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Desativar Plano
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Ativar Plano
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Ver Estatísticas
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-dark-border" />
                              <DropdownMenuItem 
                                className="cursor-pointer text-negative"
                                onClick={() => handleDelete(plan)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir Plano
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-dark-card border-dark-border">
              <CardHeader>
                <CardTitle>Estatísticas de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48">
                  <BarChart3 className="h-10 w-10 text-secondary/50" />
                  <p className="ml-2 text-light-subtext">Estatísticas serão exibidas aqui</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-card border-dark-border">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-surface/80 p-4 rounded-lg">
                    <p className="text-light-subtext text-sm mb-1">Total de Planos</p>
                    <p className="text-2xl font-bold text-light-text">{plans.length}</p>
                  </div>
                  <div className="bg-dark-surface/80 p-4 rounded-lg">
                    <p className="text-light-subtext text-sm mb-1">Planos Ativos</p>
                    <p className="text-2xl font-bold text-light-text">{plans.filter(p => p.isActive).length}</p>
                  </div>
                  <div className="bg-dark-surface/80 p-4 rounded-lg">
                    <p className="text-light-subtext text-sm mb-1">Valor Mínimo</p>
                    <p className="text-2xl font-bold text-light-text">
                      R$ {Math.min(...plans.map(p => p.minimumInvestment)).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="bg-dark-surface/80 p-4 rounded-lg">
                    <p className="text-light-subtext text-sm mb-1">Taxa Média</p>
                    <p className="text-2xl font-bold text-light-text">
                      {(plans.reduce((acc, plan) => acc + plan.dailyInterestRate, 0) / plans.length).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border">
          <DialogHeader>
            <DialogTitle className="text-light-text">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-light-subtext">
              Você está prestes a excluir o seguinte plano de investimento:
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-negative/20 flex items-center justify-center">
                  <Trash2 className="h-8 w-8 text-negative" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-light-subtext">ID do Plano:</p>
                <p className="text-light-text font-medium">{selectedPlan.id}</p>
                
                <p className="text-light-subtext">Nome:</p>
                <p className="text-light-text font-medium">{selectedPlan.name}</p>
                
                <p className="text-light-subtext">Investimento Mínimo:</p>
                <p className="text-light-text font-medium">R$ {selectedPlan.minimumInvestment.toLocaleString('pt-BR')}</p>
                
                <p className="text-light-subtext">Taxa de Rendimento:</p>
                <p className="text-light-text font-medium">{getFormattedRate(selectedPlan.dailyInterestRate)}</p>
              </div>
              
              <div className="bg-negative/10 border border-negative/20 rounded-md p-3 text-negative">
                <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                <span>Essa ação não pode ser desfeita. Considere desativar o plano em vez de excluí-lo.</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-dark-border hover:bg-dark-surface/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-negative hover:bg-negative/90 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}