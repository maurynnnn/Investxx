import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  Plus, 
  Trash, 
  CreditCard as CreditCardIcon, 
  Edit, 
  Check,
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
  const [activeTab, setActiveTab] = useState("cards");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Dados simulados
  const paymentMethods = {
    cards: [
      { id: '1', type: 'visa', last4: '1234', expiry: '12/25', name: 'João Silva' },
      { id: '2', type: 'mastercard', last4: '5678', expiry: '10/26', name: 'João Silva' }
    ],
    bankAccounts: [
      { id: '1', bankName: 'Banco do Brasil', accountType: 'Conta Corrente', accountNumber: '****1234', name: 'João Silva' }
    ],
    cryptoWallets: [
      { id: '1', currency: 'Bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', label: 'Carteira Principal' },
      { id: '2', currency: 'Ethereum', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', label: 'Carteira ETH' }
    ]
  };

  function handleSaveCard() {
    toast({
      title: "Cartão adicionado",
      description: "Seu novo cartão foi adicionado com sucesso.",
    });
  }

  function handleSaveBankAccount() {
    toast({
      title: "Conta bancária adicionada",
      description: "Sua nova conta bancária foi adicionada com sucesso.",
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

  // Utilitário para mascarar número do cartão
  function formatCardNumber(value: string) {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Métodos de Pagamento</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus métodos de pagamento para depósitos e saques</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-dark-surface border border-dark-border p-1">
            <TabsTrigger 
              value="cards" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Cartões
            </TabsTrigger>
            <TabsTrigger 
              value="bank-accounts" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Contas Bancárias
            </TabsTrigger>
            <TabsTrigger 
              value="crypto" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Carteiras Crypto
            </TabsTrigger>
          </TabsList>

          {/* Cartões de Crédito */}
          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.cards.map((card) => (
                <Card key={card.id} className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-6 rounded bg-gradient-primary flex items-center justify-center mr-3">
                          {card.type === 'visa' ? (
                            <i className="ri-visa-line text-white text-lg"></i>
                          ) : (
                            <i className="ri-mastercard-line text-white text-lg"></i>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-light-text">
                            •••• •••• •••• {card.last4}
                          </p>
                          <p className="text-xs text-light-subtext mt-1">
                            Expira em {card.expiry}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          onClick={() => {
                            setSelectedMethod(card.id);
                            handleMakeDefault();
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-negative hover:text-negative hover:bg-dark-surface"
                          onClick={() => {
                            setSelectedMethod(card.id);
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

              {/* Adicionar Novo Cartão */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="backdrop-blur-md bg-dark-card/25 border-dark-border border-dashed shadow-lg cursor-pointer hover:bg-dark-card/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-light-subtext text-sm">Adicionar Novo Cartão</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                    <DialogDescription>
                      Adicione um novo cartão para facilitar seus depósitos e saques.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="bg-dark-surface border-dark-border text-light-text pl-10"
                        />
                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Data de Expiração</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/AA"
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Nome no Cartão</Label>
                      <Input
                        id="cardholderName"
                        placeholder="JOÃO S SILVA"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="flex items-center pt-2">
                      <ShieldCheck className="h-5 w-5 text-positive mr-2" />
                      <p className="text-xs text-light-subtext">
                        Seus dados de cartão estão protegidos com criptografia de ponta a ponta.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-dark-border text-light-text">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveCard}>
                      Salvar Cartão
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Contas Bancárias */}
          <TabsContent value="bank-accounts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.bankAccounts.map((account) => (
                <Card key={account.id} className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-dark-surface flex items-center justify-center mr-3">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-light-text">
                            {account.bankName}
                          </p>
                          <p className="text-xs text-light-subtext">
                            {account.accountType} - {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                          onClick={() => {
                            setSelectedMethod(account.id);
                            handleMakeDefault();
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-negative hover:text-negative hover:bg-dark-surface"
                          onClick={() => {
                            setSelectedMethod(account.id);
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

              {/* Adicionar Nova Conta Bancária */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="backdrop-blur-md bg-dark-card/25 border-dark-border border-dashed shadow-lg cursor-pointer hover:bg-dark-card/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-light-subtext text-sm">Adicionar Nova Conta Bancária</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border">
                  <DialogHeader>
                    <DialogTitle>Adicionar Conta Bancária</DialogTitle>
                    <DialogDescription>
                      Adicione uma conta bancária para facilitar seus saques.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Banco</Label>
                      <Select>
                        <SelectTrigger className="bg-dark-surface border-dark-border text-light-text">
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border">
                          <SelectItem value="bb">Banco do Brasil</SelectItem>
                          <SelectItem value="caixa">Caixa Econômica Federal</SelectItem>
                          <SelectItem value="itau">Itaú</SelectItem>
                          <SelectItem value="bradesco">Bradesco</SelectItem>
                          <SelectItem value="santander">Santander</SelectItem>
                          <SelectItem value="nubank">Nubank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Tipo de Conta</Label>
                      <Select>
                        <SelectTrigger className="bg-dark-surface border-dark-border text-light-text">
                          <SelectValue placeholder="Selecione o tipo de conta" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-card border-dark-border">
                          <SelectItem value="checking">Conta Corrente</SelectItem>
                          <SelectItem value="savings">Conta Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyNumber">Agência</Label>
                        <Input
                          id="agencyNumber"
                          placeholder="0000"
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Conta</Label>
                        <Input
                          id="accountNumber"
                          placeholder="00000-0"
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Nome do Titular</Label>
                      <Input
                        id="holderName"
                        placeholder="Nome completo"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF do Titular</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-dark-border text-light-text">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveBankAccount}>
                      Salvar Conta
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Carteiras Crypto */}
          <TabsContent value="crypto" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.cryptoWallets.map((wallet) => (
                <Card key={wallet.id} className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-dark-surface flex items-center justify-center mr-3">
                          <i className={`ri-${wallet.currency.toLowerCase()}-line text-primary text-xl`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-light-text">
                            {wallet.currency} - {wallet.label}
                          </p>
                          <p className="text-xs text-light-subtext break-all">
                            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
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
                          className="h-8 w-8 text-light-subtext hover:text-light-text hover:bg-dark-surface"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-negative hover:text-negative hover:bg-dark-surface"
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
                  <Card className="backdrop-blur-md bg-dark-card/25 border-dark-border border-dashed shadow-lg cursor-pointer hover:bg-dark-card/40 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-light-subtext text-sm">Adicionar Nova Carteira</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-dark-border">
                  <DialogHeader>
                    <DialogTitle>Adicionar Carteira de Criptomoedas</DialogTitle>
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
                        placeholder="Ex: Carteira Principal, Carteira Binance, etc."
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="pt-2 text-xs text-light-subtext">
                      <p className="mb-2">⚠️ Importante:</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li>Certifique-se de digitar o endereço corretamente.</li>
                        <li>Utilize apenas carteiras da qual você possui as chaves privadas.</li>
                        <li>Transações em blockchain são irreversíveis.</li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-dark-border text-light-text">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveCryptoWallet}>
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
        <DialogContent className="bg-dark-card border-dark-border">
          <DialogHeader>
            <DialogTitle>Remover Método de Pagamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este método de pagamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-dark-border text-light-text"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="bg-negative hover:bg-negative/80"
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