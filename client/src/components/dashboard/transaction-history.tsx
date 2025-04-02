import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getTransactionIcon, getTransactionColor } from "@/lib/utils";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

export default function TransactionHistory({ transactions, onViewAll }: TransactionHistoryProps) {
  // Format date to show relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return diffInDays === 1 ? 'Ontem' : `${diffInDays} dias atrás`;
    }
    
    if (diffInHours > 0) {
      return `${diffInHours}h atrás`;
    }
    
    if (diffInMinutes > 0) {
      return `${diffInMinutes}m atrás`;
    }
    
    return 'Agora';
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-display font-medium">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <i className="ri-exchange-line text-primary text-xl"></i>
          </div>
          <h3 className="text-sm font-medium text-light-text mb-1">Nenhuma transação</h3>
          <p className="text-xs text-light-subtext">
            Suas transações aparecerão aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display font-medium">Histórico de Transações</CardTitle>
        {transactions.length > 5 && (
          <Button 
            variant="link" 
            onClick={onViewAll} 
            className="text-secondary hover:text-secondary/80 text-sm font-medium"
          >
            Ver todas
            <i className="ri-arrow-right-line ml-1"></i>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const icon = getTransactionIcon(transaction.type);
            const colorClass = getTransactionColor(transaction.type);
            const isPositive = ['deposit', 'yield', 'commission', 'bonus'].includes(transaction.type);
            
            return (
              <div 
                key={transaction.id} 
                className="flex items-center p-2 hover:bg-dark-surface rounded-lg transition-colors"
              >
                <div className={`w-8 h-8 rounded-full bg-${colorClass}/20 flex items-center justify-center mr-3`}>
                  <i className={`${icon} text-${colorClass}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-light-text truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-light-subtext">
                    {formatRelativeTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isPositive ? 'text-positive' : transaction.type === 'investment' ? 'text-light-text' : 'text-negative'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>
            );
          })}
          
          {transactions.length > 5 && (
            <div className="text-center pt-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={onViewAll}
                className="border-dark-border text-light-subtext hover:text-light-text"
              >
                Ver mais transações
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
