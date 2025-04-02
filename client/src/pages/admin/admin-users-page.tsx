import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle, User, MoreHorizontal, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // TODO: Substituir por consulta real
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => {
      // Dados simulados
      return [
        { 
          id: 1, 
          username: "joaosilva", 
          email: "joao@exemplo.com", 
          firstName: "João", 
          lastName: "Silva",
          role: "user",
          balance: 15000,
          referralCode: "JOAO123",
          referredBy: null,
          createdAt: new Date("2023-01-15"),
          lastLogin: new Date("2023-05-21")
        },
        { 
          id: 2, 
          username: "mariasantos", 
          email: "maria@exemplo.com", 
          firstName: "Maria", 
          lastName: "Santos",
          role: "user",
          balance: 27500,
          referralCode: "MARIA456",
          referredBy: 1,
          createdAt: new Date("2023-02-10"),
          lastLogin: new Date("2023-05-20")
        },
        { 
          id: 3, 
          username: "pedroalves", 
          email: "pedro@exemplo.com", 
          firstName: "Pedro", 
          lastName: "Alves",
          role: "user",
          balance: 8750,
          referralCode: "PEDRO789",
          referredBy: 2,
          createdAt: new Date("2023-03-05"),
          lastLogin: new Date("2023-05-19")
        },
        { 
          id: 4, 
          username: "anasilva", 
          email: "ana@exemplo.com", 
          firstName: "Ana", 
          lastName: "Silva",
          role: "admin",
          balance: 52000,
          referralCode: "ANA101",
          referredBy: null,
          createdAt: new Date("2022-12-01"),
          lastLogin: new Date("2023-05-21")
        }
      ];
    },
    staleTime: 2 * 60 * 1000 // 2 minutos
  });
  
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
      title="Gerenciar Usuários"
      subtitle="Visualize e gerencie os usuários cadastrados na plataforma"
    >
      <Card className="bg-dark-card border-dark-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-subtext" />
              <Input 
                placeholder="Buscar por nome, email ou username..."
                className="pl-9 bg-dark-surface border-dark-border text-light-text"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-dark-border text-light-text hover:bg-dark-surface">
                Filtros
              </Button>
              <Button variant="outline" className="border-dark-border text-light-text hover:bg-dark-surface">
                Exportar
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
          ) : (
            <div className="rounded-md border border-dark-border">
              <Table>
                <TableHeader className="bg-dark-surface">
                  <TableRow>
                    <TableHead className="text-light-subtext">ID</TableHead>
                    <TableHead className="text-light-subtext">Usuário</TableHead>
                    <TableHead className="text-light-subtext">Email</TableHead>
                    <TableHead className="text-light-subtext">Função</TableHead>
                    <TableHead className="text-light-subtext">Saldo</TableHead>
                    <TableHead className="text-light-subtext">Cadastro</TableHead>
                    <TableHead className="text-light-subtext">Último login</TableHead>
                    <TableHead className="text-light-subtext"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id} className="hover:bg-dark-surface/50">
                      <TableCell className="font-medium text-light-text">#{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-light-text font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-light-subtext">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-light-text">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' 
                            ? 'bg-secondary/10 text-secondary' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </TableCell>
                      <TableCell className="text-light-text">
                        R$ {user.balance.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-light-subtext">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-light-subtext">
                        {formatDate(user.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-light-subtext" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-light-subtext">
              Exibindo {users?.length || 0} de {users?.length || 0} usuários
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-dark-border text-light-text hover:bg-dark-surface"
                disabled
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-dark-border text-light-text hover:bg-dark-surface"
                disabled
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}