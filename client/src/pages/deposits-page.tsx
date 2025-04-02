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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CopyIcon, CheckIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

const depositSchema = z.object({
  amount: z.coerce.number().min(50, "O valor mínimo para depósito é R$ 50,00"),
  method: z.enum(["pix", "transfer"], {
    required_error: "Selecione um método de depósito",
  }),
  receipt: z.string().optional(),
});

type DepositFormValues = z.infer<typeof depositSchema>;

export default function DepositsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const { data: deposits, isLoading } = useQuery({
    queryKey: ["/api/deposits"],
  });

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 100,
      method: "pix",
      receipt: "",
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: DepositFormValues) => {
      const res = await apiRequest("POST", "/api/deposits", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deposits"] });
      toast({
        title: "Solicitação de depósito enviada",
        description: "Seu depósito será aprovado em breve após a confirmação do pagamento.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao solicitar depósito",
        description: error.message || "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: DepositFormValues) {
    depositMutation.mutate(values);
  }

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast({
      title: "Copiado para a área de transferência",
      description: `${type} copiado com sucesso.`,
    });
    setTimeout(() => setCopiedText(""), 2000);
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

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Depósitos</h1>
          <p className="text-muted-foreground mt-1">Deposite fundos em sua conta para começar a investir</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90"
        >
          Novo Depósito
        </Button>
      </div>

      <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
        <CardHeader>
          <CardTitle>Histórico de Depósitos</CardTitle>
          <CardDescription>Todos os seus depósitos e seu status atual</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : deposits?.length > 0 ? (
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
                {deposits.map((deposit: any) => (
                  <TableRow key={deposit.id} className="border-dark-border">
                    <TableCell>{formatDate(new Date(deposit.createdAt))}</TableCell>
                    <TableCell className="capitalize">{deposit.method === "pix" ? "PIX" : "Transferência"}</TableCell>
                    <TableCell className="text-right">R$ {deposit.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{getBadgeForStatus(deposit.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Você ainda não tem histórico de depósitos.</p>
              <p className="mt-2">Faça seu primeiro depósito para começar a investir!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border text-light-text sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Depósito</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Escolha o método e valor para adicionar fundos à sua conta
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a depositar</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={50}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo: R$ 50,00
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
                    <FormLabel>Método de depósito</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pix" id="pix" className="border-primary text-primary" />
                          <Label htmlFor="pix" className="flex items-center">
                            <i className="ri-bank-card-line mr-2 text-xl"></i>
                            PIX
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="transfer" id="transfer" className="border-primary text-primary" />
                          <Label htmlFor="transfer" className="flex items-center">
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

              {form.watch("method") === "pix" && (
                <div className="space-y-4 p-4 bg-dark-surface rounded-lg">
                  <p className="text-sm font-medium">Chave PIX:</p>
                  <div className="flex items-center justify-between bg-dark-bg p-2 rounded border border-dark-border">
                    <code className="text-sm">investx@financas.com</code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("investx@financas.com", "PIX")}
                      className="h-8 px-2"
                    >
                      {copiedText === "PIX" ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Faça o pagamento PIX para a chave acima e guarde o comprovante.
                  </p>
                </div>
              )}

              {form.watch("method") === "transfer" && (
                <div className="space-y-4 p-4 bg-dark-surface rounded-lg">
                  <p className="text-sm font-medium">Dados Bancários:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Banco:</span>
                      <span className="text-sm">260 - NuBank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Agência:</span>
                      <span className="text-sm">0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conta:</span>
                      <span className="text-sm">12345678-9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Titular:</span>
                      <span className="text-sm">InvestX Finanças LTDA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CNPJ:</span>
                      <span className="text-sm">12.345.678/0001-90</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("Banco: 260 - NuBank\nAgência: 0001\nConta: 12345678-9\nTitular: InvestX Finanças LTDA\nCNPJ: 12.345.678/0001-90", "Dados bancários")}
                    className="w-full border-dark-border text-muted-foreground"
                  >
                    {copiedText === "Dados bancários" ? "Dados copiados!" : "Copiar todos os dados"}
                  </Button>
                </div>
              )}

              <FormField
                control={form.control}
                name="receipt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Cole aqui o código do comprovante ou informe o ID da transação"
                        className="bg-dark-surface border-dark-border text-light-text resize-none h-20"
                      />
                    </FormControl>
                    <FormDescription>
                      Informar o comprovante acelera a aprovação do seu depósito
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
                  disabled={depositMutation.isPending}
                >
                  {depositMutation.isPending ? (
                    <div className="flex items-center">
                      <span className="mr-2">Processando</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    "Confirmar Depósito"
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
