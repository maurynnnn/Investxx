import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MainLayout from "@/components/layout/main-layout";
import InvestmentPlanCard from "@/components/investments/investment-plan-card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useState } from "react";
import { Loader2 } from "lucide-react";

const investmentSchema = z.object({
  planId: z.number(),
  amount: z.coerce.number().min(1, "Valor deve ser maior que zero"),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

export default function InvestmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["/api/plans"],
  });

  const { data: userBalance } = useQuery({
    queryKey: ["/api/dashboard"],
    select: (data) => data.balance,
  });

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      planId: 0,
      amount: 0,
    },
  });

  const investMutation = useMutation({
    mutationFn: async (data: InvestmentFormValues) => {
      const res = await apiRequest("POST", "/api/investments", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({
        title: "Investimento realizado com sucesso",
        description: "Seu investimento foi registrado e começará a render imediatamente.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao realizar investimento",
        description: error.message || "Não foi possível processar seu investimento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInvestClick = (plan: any) => {
    setSelectedPlan(plan);
    form.setValue("planId", plan.id);
    form.setValue("amount", plan.minimumInvestment);
    setIsDialogOpen(true);
  };

  function onSubmit(values: InvestmentFormValues) {
    if (values.amount > (userBalance || 0)) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para este investimento.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlan && values.amount < selectedPlan.minimumInvestment) {
      toast({
        title: "Valor mínimo não atingido",
        description: `O investimento mínimo para este plano é de R$ ${selectedPlan.minimumInvestment.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate(values);
  }

  if (isLoadingPlans) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Planos de Investimento</h1>
        <div className="hidden sm:flex items-center">
          <span className="mr-2 text-muted-foreground text-sm">Visualizar</span>
          <div className="flex border border-dark-border rounded-md overflow-hidden">
            <Button variant="ghost" size="sm" className="bg-dark-surface text-muted-foreground rounded-none">
              <i className="ri-layout-grid-line"></i>
            </Button>
            <Button variant="ghost" size="sm" className="bg-primary text-white rounded-none">
              <i className="ri-layout-row-line"></i>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plans?.map((plan: any) => (
          <InvestmentPlanCard
            key={plan.id}
            plan={plan}
            onInvestClick={() => handleInvestClick(plan)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-light-text sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Investir no Plano {selectedPlan?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Rendimento diário de {selectedPlan ? (selectedPlan.dailyInterestRate * 100).toFixed(0) : 0}%
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a investir</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={selectedPlan?.minimumInvestment}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </FormControl>
                    <FormDescription>
                      Investimento mínimo: R$ {selectedPlan?.minimumInvestment.toFixed(2)}
                    </FormDescription>
                    <FormDescription>
                      Seu saldo: R$ {userBalance?.toFixed(2) || "0.00"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-dark-border text-muted-foreground"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={investMutation.isPending}
                >
                  {investMutation.isPending ? (
                    <div className="flex items-center">
                      <span className="mr-2">Processando</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Confirmar Investimento"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
