import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  QrCode, 
  Plus, 
  Trash, 
  Edit, 
  Check,
  Copy,
  ShieldCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pix");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Dados simulados
  const paymentMethods = {
    pix: [
      { id: '1', type: 'email', key: 'usuario@exemplo.com', label: 'Email principal' },
      { id: '2', type: 'cpf', key: '***.***.***-**', label: 'CPF' }
    ],
    cryptoWallets: [
      { id: '1', currency: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', label: 'Carteira Principal' },
      { id: '2', currency: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', label: 'Carteira ETH' }
    ]
  };

  function handleSavePix() {
    toast({
      title: "Chave Pix adicionada",
      description: "Sua nova chave Pix foi adicionada com sucesso.",
    });
  }

  function handleSaveCryptoWallet() {
    toast({
      title: "Carteira adicionada",
      description: "Sua nova carteira de criptomoedas foi adicionada com sucesso.",
    });
  }

  function handleDeleteMethod() {
    toast({
      title: "Método de pagamento removido",
      description: "O método de pagamento foi removido com sucesso.",
    });
    setIsDeleteDialogOpen(false);
  }

  function handleMakeDefault() {
    toast({
      title: "Método padrão alterado",
      description: "Seu método de pagamento padrão foi atualizado.",
    });
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência.",
    });
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Métodos de Pagamento</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus métodos para depósitos e saques</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="bg-dark-surface border border-dark-border p-1 w-full">
              <TabsTrigger 
                value="pix" 
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <QrCode className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">Pix</span>
              </TabsTrigger>
              <TabsTrigger 
                value="crypto" 
                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">Crypto</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Pix */}
          <TabsContent value="pix" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {paymentMethods.pix.map((pix) => (
                <Card key={pix.id} className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-dark-surface flex items-center justify-center mr-3 flex-shrink-0">
                          <QrCode className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-light-text">
                            {pix.type === 'email' ? 'Email' : 'CPF'}
                          </p>
                          <p className="text-xs text-light-subtext truncate" title={pix.key}>
                            {pix.key}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          title="Copiar"
                          onClick={() => handleCopy(pix.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          title="Definir como padrão"
                          onClick={() => {
                            setSelectedMethod(pix.id);
                            handleMakeDefault();
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-negative hover:text-negative hover:bg-dark-surface"
                          title="Remover"
                          onClick={() => {
                            setSelectedMethod(pix.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Adicionar Nova Chave Pix */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="backdrop-blur-md bg-dark-card/25 border-dark-border border-dashed shadow-md cursor-pointer hover:bg-dark-card/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-light-subtext text-sm">Adicionar Chave Pix</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Chave Pix</DialogTitle>
                    <DialogDescription>
                      Adicione uma chave Pix para facilitar seus depósitos e saques.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pixType">Tipo de Chave</Label>
                      <Select>
                        <SelectTrigger className="bg-dark-surface border-dark-border text-light-text">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border">
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Celular</SelectItem>
                          <SelectItem value="random">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixKey">Sua Chave Pix</Label>
                      <Input
                        id="pixKey"
                        placeholder="Digite sua chave Pix"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixLabel">Nome da Chave (opcional)</Label>
                      <Input
                        id="pixLabel"
                        placeholder="Ex: Meu Email, Meu CPF"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full sm:w-auto border-dark-border text-light-text">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={handleSavePix}>
                      Salvar Chave
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Carteiras Crypto */}
          <TabsContent value="crypto" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {paymentMethods.cryptoWallets.map((wallet) => (
                <Card key={wallet.id} className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-dark-surface flex items-center justify-center mr-3 flex-shrink-0">
                          <i className={`ri-${wallet.currency.toLowerCase()}-line text-primary text-xl`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-light-text">
                            {wallet.currency} - {wallet.label}
                          </p>
                          <p className="text-xs text-light-subtext truncate" title={wallet.address}>
                            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          title="Copiar endereço"
                          onClick={() => handleCopy(wallet.address)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          title="Definir como padrão"
                          onClick={() => {
                            setSelectedMethod(wallet.id);
                            handleMakeDefault();
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-negative hover:text-negative hover:bg-dark-surface"
                          title="Remover"
                          onClick={() => {
                            setSelectedMethod(wallet.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Adicionar Nova Carteira */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="backdrop-blur-md bg-dark-card/25 border-dark-border border-dashed shadow-md cursor-pointer hover:bg-dark-card/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-light-subtext text-sm">Adicionar Nova Carteira</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Carteira Crypto</DialogTitle>
                    <DialogDescription>
                      Adicione uma carteira para receber seus saques em criptomoedas.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cryptoCurrency">Criptomoeda</Label>
                      <Select>
                        <SelectTrigger className="bg-dark-surface border-dark-border text-light-text">
                          <SelectValue placeholder="Selecione a criptomoeda" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border">
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="tether">Tether (USDT)</SelectItem>
                          <SelectItem value="bnb">Binance Coin (BNB)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Endereço da Carteira</Label>
                      <Input
                        id="walletAddress"
                        placeholder="Digite o endereço completo da carteira"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletLabel">Identificação (opcional)</Label>
                      <Input
                        id="walletLabel"
                        placeholder="Ex: Carteira Principal, Binance, etc."
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="pt-2 text-xs text-light-subtext bg-dark-surface/60 p-3 rounded-md">
                      <p className="mb-2 font-medium">⚠️ Importante:</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li>Certifique-se de digitar o endereço corretamente.</li>
                        <li>Utilize apenas carteiras da qual você possui as chaves privadas.</li>
                        <li>Transações em blockchain são irreversíveis.</li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full sm:w-auto border-dark-border text-light-text">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={handleSaveCryptoWallet}>
                      Salvar Carteira
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-border max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Método de Pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este método de pagamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-dark-border text-light-text"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto bg-negative hover:bg-negative/80"
              onClick={handleDeleteMethod}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}