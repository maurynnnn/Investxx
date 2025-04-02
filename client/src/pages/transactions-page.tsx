import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency, formatDate, getTransactionIcon, getTransactionColor } from "@/lib/utils";
import { CalendarIcon, Download, Filter, Search } from "lucide-react";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Filtra transações baseado nos critérios
  const filteredTransactions = transactions.filter((transaction: any) => {
    // Filtro por tipo (aba ativa)
    if (activeTab !== "all" && transaction.type !== activeTab) {
      return false;
    }

    // Filtro por tipo no dropdown
    if (filterType !== "all" && transaction.type !== filterType) {
      return false;
    }

    // Filtro por termo de busca
    if (
      searchQuery &&
      !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filtro por data
    if (dateRange.from) {
      const transactionDate = new Date(transaction.createdAt);
      if (transactionDate < dateRange.from) {
        return false;
      }
    }

    if (dateRange.to) {
      const transactionDate = new Date(transaction.createdAt);
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      if (transactionDate > endOfDay) {
        return false;
      }
    }

    return true;
  });

  function handleExportCSV() {
    // Lógica para exportar transações em CSV
    alert("Exportação em CSV será implementada em breve.");
  }

  function handleClearFilters() {
    setSearchQuery("");
    setFilterType("all");
    setDateRange({});
  }

  function getStatusBadge(type: string) {
    let color = "bg-primary/20 text-primary border-primary/50";
    
    if (type === "deposit" || type === "yield" || type === "commission" || type === "bonus") {
      color = "bg-green-500/20 text-green-500 border-green-500/50";
    } else if (type === "withdrawal" || type === "withdrawal_request") {
      color = "bg-red-500/20 text-red-500 border-red-500/50";
    } else if (type === "investment") {
      color = "bg-blue-500/20 text-blue-500 border-blue-500/50";
    }
    
    // Traduzir tipo para português
    let label = "Desconhecido";
    switch (type) {
      case "deposit":
        label = "Depósito";
        break;
      case "withdrawal":
        label = "Saque";
        break;
      case "withdrawal_request":
        label = "Solicitação de Saque";
        break;
      case "investment":
        label = "Investimento";
        break;
      case "yield":
        label = "Rendimento";
        break;
      case "commission":
        label = "Comissão";
        break;
      case "bonus":
        label = "Bônus";
        break;
    }
    
    return (
      <Badge variant="outline" className={color}>
        {label}
      </Badge>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Minhas Transações</h1>
            <p className="text-muted-foreground mt-1">Visualize e filtre seu histórico de transações</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <Button 
              variant="outline" 
              className="border-dark-border text-light-text hover:bg-dark-surface flex items-center"
              onClick={handleExportCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <TabsList className="bg-dark-surface border border-dark-border h-auto">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Todas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="deposit" 
                    className="data-[state=active]:bg-positive data-[state=active]:text-white"
                  >
                    Depósitos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="withdrawal" 
                    className="data-[state=active]:bg-negative data-[state=active]:text-white"
                  >
                    Saques
                  </TabsTrigger>
                  <TabsTrigger 
                    value="investment" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Investimentos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="yield" 
                    className="data-[state=active]:bg-positive data-[state=active]:text-white"
                  >
                    Rendimentos
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar transação..."
                      className="bg-dark-surface border-dark-border text-light-text pl-9 w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select 
                      value={filterType} 
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger 
                        className="bg-dark-surface border-dark-border text-light-text w-full sm:w-[150px]"
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-card border-dark-border">
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="deposit">Depósito</SelectItem>
                        <SelectItem value="withdrawal">Saque</SelectItem>
                        <SelectItem value="investment">Investimento</SelectItem>
                        <SelectItem value="yield">Rendimento</SelectItem>
                        <SelectItem value="commission">Comissão</SelectItem>
                        <SelectItem value="bonus">Bônus</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-dark-border bg-dark-surface text-light-text hover:bg-dark-surface/80 h-10 pl-3 pr-3"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                              </>
                            ) : (
                              formatDate(dateRange.from)
                            )
                          ) : (
                            "Período"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="bg-dark-card border-dark-border p-0" 
                        align="end"
                      >
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                          className="bg-dark-card text-light-text"
                        />
                        <div className="flex justify-end p-3 border-t border-dark-border">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setDateRange({})}
                            className="border-dark-border text-light-text hover:bg-dark-surface mr-2"
                          >
                            Limpar
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {(searchQuery || filterType !== "all" || dateRange.from || dateRange.to) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearFilters}
                        className="text-light-subtext hover:text-light-text"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        <span className="sr-only">Limpar filtros</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <div className="rounded-md border border-dark-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-dark-surface/60">
                        <TableRow className="border-dark-border hover:bg-transparent">
                          <TableHead className="w-[300px]">Descrição</TableHead>
                          <TableHead className="hidden md:table-cell">Data</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction: any) => {
                          const icon = getTransactionIcon(transaction.type);
                          const colorClass = getTransactionColor(transaction.type);
                          const isPositive = ['deposit', 'yield', 'commission', 'bonus'].includes(transaction.type);
                          
                          return (
                            <TableRow key={transaction.id} className="border-dark-border">
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full bg-${colorClass}/20 flex items-center justify-center mr-3`}>
                                    <i className={`${icon} text-${colorClass}`}></i>
                                  </div>
                                  <span className="text-light-text truncate">{transaction.description}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-light-subtext">
                                {formatDate(new Date(transaction.createdAt))}
                              </TableCell>
                              <TableCell>{getStatusBadge(transaction.type)}</TableCell>
                              <TableCell className={`text-right font-medium ${
                                isPositive ? 'text-positive' : transaction.type === 'investment' ? 'text-light-text' : 'text-negative'
                              }`}>
                                {isPositive ? '+ ' : ''}
                                {formatCurrency(Math.abs(transaction.amount))}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-dark-surface flex items-center justify-center mb-3">
                      <i className="ri-search-line text-light-subtext text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-light-text">Nenhuma transação encontrada</h3>
                    <p className="text-muted-foreground mt-1">
                      Tente ajustar seus filtros ou busque por outra transação.
                    </p>
                    {(searchQuery || filterType !== "all" || dateRange.from || dateRange.to) && (
                      <Button
                        variant="outline"
                        className="mt-4 border-dark-border text-light-text hover:bg-dark-surface"
                        onClick={handleClearFilters}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}