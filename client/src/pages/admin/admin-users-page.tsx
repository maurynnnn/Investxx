import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { User } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, Search, UserCheck, UserX, CheckCircle2, XCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    // Mocked data since we're not implementing the backend yet
    placeholderData: Array(25).fill(0).map((_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      firstName: `Nome${i + 1}`,
      lastName: `Sobrenome${i + 1}`,
      password: "hashedpassword",
      role: i === 0 ? "admin" : "user",
      balance: Math.random() * 10000,
      referralCode: `REF${i + 1}`,
      referredBy: i > 5 ? Math.floor(Math.random() * 5) + 1 : null,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      lastLogin: new Date(Date.now() - Math.random() * 1000000000),
    })),
  });

  // Função para filtrar usuários com base no termo de pesquisa
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Usuários" subtitle="Visualize e gerencie contas de usuários">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciamento de Usuários" subtitle="Visualize e gerencie contas de usuários">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Lista de Usuários</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtext" />
              <Input
                type="text"
                placeholder="Buscar usuários..."
                className="pl-8 bg-dark-component border-dark-border"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dark-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-light-subtext">{user.firstName} {user.lastName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "default" : "outline"}
                          className={user.role === "admin" ? "bg-primary text-white" : ""}
                        >
                          {user.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(user.balance)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-100/10"
                            title="Bloquear usuário"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                            title="Verificar usuário"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-light-subtext">
                      Nenhum usuário encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {filteredUsers.length > itemsPerPage && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Mostrar primeira, última e páginas próximas da atual
                    return page === 1 || 
                           page === totalPages || 
                           (page >= currentPage - 1 && page <= currentPage + 1);
                  })
                  .map((page, i, arr) => {
                    // Adicionar reticências quando há lacunas
                    if (i > 0 && arr[i - 1] !== page - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationLink href="#" onClick={(e) => e.preventDefault()} className="pointer-events-none">
                            ...
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas de usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-primary mr-3" />
              <p className="text-3xl font-bold text-light-text">{users?.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-primary mr-3" />
              <p className="text-3xl font-bold text-light-text">
                {users?.filter(user => user.role === "admin").length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-positive mr-3" />
              <p className="text-3xl font-bold text-light-text">
                {users?.filter(user => {
                  const lastLoginDate = user.lastLogin;
                  if (!lastLoginDate) return false;
                  // Considerando ativos aqueles que logaram nos últimos 30 dias
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastLoginDate > thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuários Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-negative mr-3" />
              <p className="text-3xl font-bold text-light-text">
                {users?.filter(user => {
                  const lastLoginDate = user.lastLogin;
                  if (!lastLoginDate) return true;
                  // Considerando inativos aqueles que não logaram nos últimos 30 dias
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return lastLoginDate < thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}