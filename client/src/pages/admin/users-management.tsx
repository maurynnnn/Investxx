import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { 
  User, 
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  UserCog,
  Mail,
  Calendar,
  Clock,
  Wallet
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

// Dados simulados para visualização
const mockUsers = [
  { 
    id: 1, 
    firstName: "João", 
    lastName: "Silva", 
    email: "joao.silva@exemplo.com", 
    role: "admin",
    balance: 15000, 
    createdAt: new Date("2023-01-15"),
    lastLogin: new Date("2023-06-10"),
    referralCode: "JS15ABC",
    status: "active"
  },
  { 
    id: 2, 
    firstName: "Maria", 
    lastName: "Oliveira", 
    email: "maria.oliveira@exemplo.com", 
    role: "user",
    balance: 8500, 
    createdAt: new Date("2023-02-20"),
    lastLogin: new Date("2023-06-08"),
    referralCode: "MO20DEF",
    status: "active"
  },
  { 
    id: 3, 
    firstName: "Carlos", 
    lastName: "Pereira", 
    email: "carlos.pereira@exemplo.com", 
    role: "user",
    balance: 12000, 
    createdAt: new Date("2023-03-05"),
    lastLogin: new Date("2023-06-09"),
    referralCode: "CP05GHI",
    status: "active"
  },
  { 
    id: 4, 
    firstName: "Ana", 
    lastName: "Santos", 
    email: "ana.santos@exemplo.com", 
    role: "user",
    balance: 5000, 
    createdAt: new Date("2023-04-10"),
    lastLogin: new Date("2023-06-07"),
    referralCode: "AS10JKL",
    status: "inactive"
  },
  { 
    id: 5, 
    firstName: "Pedro", 
    lastName: "Costa", 
    email: "pedro.costa@exemplo.com", 
    role: "user",
    balance: 7500, 
    createdAt: new Date("2023-05-15"),
    lastLogin: new Date("2023-06-06"),
    referralCode: "PC15MNO",
    status: "active"
  }
];

export default function UsersManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredUsers(mockUsers);
      return;
    }
    
    const results = mockUsers.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.referralCode.toLowerCase().includes(term)
    );
    
    setFilteredUsers(results);
  };
  
  const getUserStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">Ativo</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500">Inativo</span>;
  };
  
  const getUserRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary">Admin</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500">Usuário</span>;
  };

  if (!user || user.role !== 'admin') {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Shield className="h-12 w-12 text-negative mb-4" />
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
            Gerenciamento de Usuários
          </h1>
          <p className="text-light-subtext">
            Visualize, pesquise e gerencie os usuários registrados na plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="bg-dark-card border-dark-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Usuários do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtext" />
                    <Input
                      type="search"
                      placeholder="Buscar por nome, email ou código..."
                      className="w-full pl-9 bg-dark-surface border-dark-border"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button variant="outline" size="sm" className="h-9 gap-1 border-dark-border text-light-subtext">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </Button>
                    <Button variant="default" size="sm" className="h-9 bg-secondary hover:bg-secondary/90">
                      <UserCog className="h-4 w-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border border-dark-border">
                  <Table>
                    <TableHeader className="bg-dark-surface">
                      <TableRow className="hover:bg-transparent border-dark-border">
                        <TableHead className="text-light-subtext">ID</TableHead>
                        <TableHead className="text-light-subtext">Usuário</TableHead>
                        <TableHead className="text-light-subtext">Email</TableHead>
                        <TableHead className="text-light-subtext hidden lg:table-cell">Saldo</TableHead>
                        <TableHead className="text-light-subtext hidden lg:table-cell">Criado em</TableHead>
                        <TableHead className="text-light-subtext hidden md:table-cell">Último Login</TableHead>
                        <TableHead className="text-light-subtext">Status</TableHead>
                        <TableHead className="text-light-subtext">Função</TableHead>
                        <TableHead className="text-light-subtext text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-dark-surface/50 border-dark-border">
                          <TableCell className="font-medium text-light-text">{user.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center">
                                <span className="text-xs font-medium">{user.firstName[0]}{user.lastName[0]}</span>
                              </div>
                              <div>
                                <p className="text-sm text-light-text">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-light-subtext hidden sm:block">{user.referralCode}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm text-light-text">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center">
                              <Wallet className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm text-light-text">R$ {user.balance.toLocaleString('pt-BR')}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm text-light-text">{formatDate(user.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 text-light-subtext mr-1.5" />
                              <span className="text-sm text-light-text">{formatDate(user.lastLogin)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                          <TableCell>{getUserRoleBadge(user.role)}</TableCell>
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
                                  Visualizar Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Editar Usuário
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Ver Investimentos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-dark-border" />
                                <DropdownMenuItem className="cursor-pointer text-negative">
                                  Desativar Usuário
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <User className="h-8 w-8 text-light-subtext mb-2" />
                              <p className="text-light-subtext">Nenhum usuário encontrado</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-light-subtext">
                    Mostrando <span className="font-medium text-light-text">{filteredUsers.length}</span> de <span className="font-medium text-light-text">{mockUsers.length}</span> usuários
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 border-dark-border text-light-subtext" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-dark-border text-light-subtext bg-primary/10 border-primary/50">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-dark-border text-light-subtext" disabled>
                      Próximo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}