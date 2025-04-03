import { MainLayout } from "../../components/layout/main-layout";
import { AdminLayout } from "../../components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";

export default function UsersManagement() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    placeholderData: [
      { id: 1, username: "user1", email: "user1@example.com", role: "user", status: "active" },
      { id: 2, username: "user2", email: "user2@example.com", role: "user", status: "blocked" },
    ]
  });

  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const { toast } = useToast();

  return (
    <AdminLayout title="Gerenciamento de Usuários" subtitle="Gerencie os usuários da plataforma">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Usuários</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
                <Input 
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
                <Input 
                  type="password"
                  placeholder="Senha"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <Button className="w-full" onClick={() => {
                  toast({
                    title: "Usuário criado",
                    description: "O usuário foi criado com sucesso"
                  });
                }}>
                  Criar Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable 
          data={users || []}
          columns={[
            { header: "ID", accessorKey: "id" },
            { header: "Username", accessorKey: "username" },
            { header: "Email", accessorKey: "email" },
            { header: "Role", accessorKey: "role" },
            { header: "Status", accessorKey: "status" },
            { 
              header: "Ações",
              cell: () => (
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm" className="text-negative">Bloquear</Button>
                </div>
              )
            }
          ]}
        />
      </div>
    </AdminLayout>
  );
}