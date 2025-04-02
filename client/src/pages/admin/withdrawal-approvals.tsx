import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertTriangle, 
  Check, 
  X, 
  Wallet, 
  Calendar, 
  Clock, 
  Eye,
  AlertCircle, 
  CheckCircle2,
  Ban
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Dados simulados para visualização
const mockWithdrawals = [
  {
    id: 1,
    userId: 5,
    userName: "Pedro Costa",
    amount: 2000,
    method: "pix",
    accountInfo: "pedro.costa@email.com",
    status: "pending",
    createdAt: new Date("2023-06-08T14:30:00"),
    processedAt: null
  },
  {
    id: 2,
    userId: 3,
    userName: "Carlos Pereira",
    amount: 5000,
    method: "pix",
    accountInfo: "123.456.789-01",
    status: "pending",
    createdAt: new Date("2023-06-08T10:15:00"),
    processedAt: null
  },
  {
    id: 3,
    userId: 2,
    userName: "Maria Oliveira",
    amount: 1500,
    method: "transfer",
    accountInfo: "Banco: Itaú, Ag: 1234, Conta: 56789-0",
    status: "pending",
    createdAt: new Date("2023-06-07T16:45:00"),
    processedAt: null
  },
  {
    id: 4,
    userId: 4,
    userName: "Ana Santos",
    amount: 3500,
    method: "pix",
    accountInfo: "ana.santos@email.com",
    status: "pending",
    createdAt: new Date("2023-06-07T09:20:00"),
    processedAt: null
  },
  {
    id: 5,
    userId: 1,
    userName: "João Silva",
    amount: 10000,
    method: "transfer",
    accountInfo: "Banco: Bradesco, Ag: 5678, Conta: 12345-6",
    status: "approved",
    createdAt: new Date("2023-06-06T14:10:00"),
    processedAt: new Date("2023-06-06T15:30:00")
  }
];

export default function WithdrawalApprovals() {
  const { user } = useAuth();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<typeof mockWithdrawals[0] | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(
    mockWithdrawals.filter(w => w.status === "pending")
  );
  
  const handleApprove = (withdrawal: typeof mockWithdrawals[0]) => {
    setSelectedWithdrawal(withdrawal);
    setApproveDialogOpen(true);
  };
  
  const handleReject = (withdrawal: typeof mockWithdrawals[0]) => {
    setSelectedWithdrawal(withdrawal);
    setRejectDialogOpen(true);
  };
  
  const confirmApprove = () => {
    // Aqui implementaríamos a chamada à API para aprovar o saque
    setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== selectedWithdrawal?.id));
    setApproveDialogOpen(false);
  };
  
  const confirmReject = () => {
    // Aqui implementaríamos a chamada à API para rejeitar o saque
    setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== selectedWithdrawal?.id));
    setRejectDialogOpen(false);
  };
  
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'pix':
        return <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-500">PIX</Badge>;
      case 'transfer':
        return <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-500">Transferência</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
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
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-light-text">
            Aprovação de Saques
          </h1>
          <p className="text-light-subtext">
            Revise e aprove as solicitações de saque pendentes dos usuários.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="bg-dark-card border-dark-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Solicitações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dark-border">
                <Table>
                  <TableHeader className="bg-dark-surface">
                    <TableRow className="hover:bg-transparent border-dark-border">
                      <TableHead className="text-light-subtext">ID</TableHead>
                      <TableHead className="text-light-subtext">Usuário</TableHead>
                      <TableHead className="text-light-subtext">Valor</TableHead>
                      <TableHead className="text-light-subtext">Método</TableHead>
                      <TableHead className="text-light-subtext hidden md:table-cell">Dados da Conta</TableHead>
                      <TableHead className="text-light-subtext hidden lg:table-cell">Data Solicitação</TableHead>
                      <TableHead className="text-light-subtext text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingWithdrawals.length > 0 ? (
                      pendingWithdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id} className="hover:bg-dark-surface/50 border-dark-border">
                          <TableCell className="font-medium text-light-text">{withdrawal.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center">
                                <span className="text-xs font-medium">{withdrawal.userName.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <div>
                                <p className="text-sm text-light-text">{withdrawal.userName}</p>
                                <p className="text-xs text-light-subtext">ID: {withdrawal.userId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Wallet className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm font-medium text-light-text">{formatCurrency(withdrawal.amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getMethodLabel(withdrawal.method)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate hidden md:table-cell">
                            <span className="text-sm text-light-text">{withdrawal.accountInfo}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm text-light-text">{formatDate(withdrawal.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-dark-surface/80 hover:text-light-text"
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                                title="Aprovar saque"
                                onClick={() => handleApprove(withdrawal)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-negative hover:bg-negative/10 hover:text-negative"
                                title="Rejeitar saque"
                                onClick={() => handleReject(withdrawal)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-light-subtext mb-2" />
                            <p className="text-light-subtext">Não há solicitações de saque pendentes</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-dark-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Histórico de Saques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dark-border">
                <Table>
                  <TableHeader className="bg-dark-surface">
                    <TableRow className="hover:bg-transparent border-dark-border">
                      <TableHead className="text-light-subtext">ID</TableHead>
                      <TableHead className="text-light-subtext">Usuário</TableHead>
                      <TableHead className="text-light-subtext">Valor</TableHead>
                      <TableHead className="text-light-subtext">Método</TableHead>
                      <TableHead className="text-light-subtext">Status</TableHead>
                      <TableHead className="text-light-subtext hidden md:table-cell">Solicitado em</TableHead>
                      <TableHead className="text-light-subtext hidden lg:table-cell">Processado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWithdrawals
                      .filter(w => w.status !== "pending")
                      .map((withdrawal) => (
                        <TableRow key={withdrawal.id} className="hover:bg-dark-surface/50 border-dark-border">
                          <TableCell className="font-medium text-light-text">{withdrawal.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center">
                                <span className="text-xs font-medium">{withdrawal.userName.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <span className="text-sm text-light-text">{withdrawal.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-light-text">{formatCurrency(withdrawal.amount)}</span>
                          </TableCell>
                          <TableCell>
                            {getMethodLabel(withdrawal.method)}
                          </TableCell>
                          <TableCell>
                            {withdrawal.status === "approved" ? (
                              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-500">Aprovado</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-negative/10 border-negative/30 text-negative">Rejeitado</Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm text-light-text">{formatDate(withdrawal.createdAt)}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm text-light-text">
                              {withdrawal.processedAt 
                                ? formatDate(withdrawal.processedAt) 
                                : "N/A"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogo de confirmação de aprovação */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border">
          <DialogHeader>
            <DialogTitle className="text-light-text">Confirmar Aprovação</DialogTitle>
            <DialogDescription className="text-light-subtext">
              Você está prestes a aprovar a seguinte solicitação de saque:
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-light-subtext">ID da Solicitação:</p>
                <p className="text-light-text font-medium">{selectedWithdrawal.id}</p>
                
                <p className="text-light-subtext">Usuário:</p>
                <p className="text-light-text font-medium">{selectedWithdrawal.userName}</p>
                
                <p className="text-light-subtext">Valor:</p>
                <p className="text-light-text font-medium">{formatCurrency(selectedWithdrawal.amount)}</p>
                
                <p className="text-light-subtext">Método:</p>
                <p className="text-light-text font-medium">
                  {selectedWithdrawal.method === 'pix' ? 'PIX' : 'Transferência Bancária'}
                </p>
                
                <p className="text-light-subtext">Dados da Conta:</p>
                <p className="text-light-text font-medium break-all">{selectedWithdrawal.accountInfo}</p>
                
                <p className="text-light-subtext">Data da Solicitação:</p>
                <p className="text-light-text font-medium">{formatDate(selectedWithdrawal.createdAt)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setApproveDialogOpen(false)}
              className="border-dark-border hover:bg-dark-surface/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de rejeição */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border">
          <DialogHeader>
            <DialogTitle className="text-light-text">Confirmar Rejeição</DialogTitle>
            <DialogDescription className="text-light-subtext">
              Você está prestes a rejeitar a seguinte solicitação de saque:
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-negative/20 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-negative" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-light-subtext">ID da Solicitação:</p>
                <p className="text-light-text font-medium">{selectedWithdrawal.id}</p>
                
                <p className="text-light-subtext">Usuário:</p>
                <p className="text-light-text font-medium">{selectedWithdrawal.userName}</p>
                
                <p className="text-light-subtext">Valor:</p>
                <p className="text-light-text font-medium">{formatCurrency(selectedWithdrawal.amount)}</p>
                
                <p className="text-light-subtext">Método:</p>
                <p className="text-light-text font-medium">
                  {selectedWithdrawal.method === 'pix' ? 'PIX' : 'Transferência Bancária'}
                </p>
              </div>
              
              <div className="bg-negative/10 border border-negative/20 rounded-md p-3 text-negative">
                <Ban className="h-4 w-4 inline-block mr-2" />
                <span>A rejeição desse saque devolverá o valor para o saldo do usuário automaticamente.</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
              className="border-dark-border hover:bg-dark-surface/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={confirmReject}
              className="bg-negative hover:bg-negative/90 text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </MainLayout>
  );
}