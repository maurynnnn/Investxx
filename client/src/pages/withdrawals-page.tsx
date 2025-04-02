import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MainLayout from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(50, "O valor mínimo para saque é R$ 50,00"),
  method: z.enum(["pix", "transfer"], {
    required_error: "Selecione um método de saque",
  }),
  accountInfo: z.string().min(5, "Informe os dados bancários ou chave PIX para recebimento"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function WithdrawalsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["/api/withdrawals"],
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 100,
      method: "pix",
      accountInfo: "",
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: WithdrawalFormValues) => {
      const res = await apiRequest("POST", "/api/withdrawals", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Solicitação de saque enviada",
        description: "Seu saque será processado dentro de 24 horas.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao solicitar saque",
        description: error.message || "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: WithdrawalFormValues) {
    if (values.amount > (dashboardData?.balance || 0)) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para este saque.",
        variant: "destructive",
      });
      return;
    }

    withdrawalMutation.mutate(values);
  }

  const getBadgeForStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pendente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Check if user can withdraw (no withdrawal in the last 2 days)
  const canWithdraw = () => {
    if (!withdrawals || withdrawals.length === 0) return true;
    
    const lastWithdrawal = withdrawals[0];
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return new Date(lastWithdrawal.createdAt) < twoDaysAgo;
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Saques</h1>
          <p className="text-muted-foreground mt-1">Solicite saques dos seus rendimentos e saldo disponível</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90"
          disabled={!canWithdraw()}
        >
          Solicitar Saque
        </Button>
      </div>

      {!canWithdraw() && (
        <Card className="mb-6 backdrop-blur-md bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-500">
              Você só pode solicitar saques a cada 2 dias. Por favor, aguarde até a próxima data disponível.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
        <CardHeader>
          <CardTitle>Histórico de Saques</CardTitle>
          <CardDescription>Todos os seus saques e seu status atual</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : withdrawals?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-dark-border">
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal: any) => (
                  <TableRow key={withdrawal.id} className="border-dark-border">
                    <TableCell>{formatDate(new Date(withdrawal.createdAt))}</TableCell>
                    <TableCell className="capitalize">{withdrawal.method === "pix" ? "PIX" : "Transferência"}</TableCell>
                    <TableCell className="text-right">R$ {withdrawal.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{getBadgeForStatus(withdrawal.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Você ainda não tem histórico de saques.</p>
              <p className="mt-2">Quando tiver rendimentos, poderá solicitar saques aqui!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-light-text sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Saque</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Informe o valor e o método para receber seus fundos
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a sacar</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={50}
                        max={dashboardData?.balance || 0}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </FormControl>
                    <FormDescription>
                      Seu saldo disponível: R$ {dashboardData?.balance?.toFixed(2) || "0.00"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de saque</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pix" id="pix-withdraw" className="border-primary text-primary" />
                          <Label htmlFor="pix-withdraw" className="flex items-center">
                            <i className="ri-bank-card-line mr-2 text-xl"></i>
                            PIX
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="transfer" id="transfer-withdraw" className="border-primary text-primary" />
                          <Label htmlFor="transfer-withdraw" className="flex items-center">
                            <i className="ri-bank-line mr-2 text-xl"></i>
                            Transferência Bancária
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("method") === "pix" ? "Chave PIX" : "Dados Bancários"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={form.watch("method") === "pix" ? "Sua chave PIX" : "Banco, Agência, Conta e Titular"}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("method") === "pix" 
                        ? "Informe a chave PIX para onde deseja receber seu saque" 
                        : "Informe os dados completos da sua conta bancária"}
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
                  disabled={withdrawalMutation.isPending}
                >
                  {withdrawalMutation.isPending ? (
                    <div className="flex items-center">
                      <span className="mr-2">Processando</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Confirmar Saque"
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
