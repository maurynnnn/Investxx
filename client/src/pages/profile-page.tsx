import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { User, Camera, KeyRound, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  function handleSaveChanges() {
    toast({
      title: "Alterações salvas",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
  }

  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-dark-surface border border-dark-border p-1">
            <TabsTrigger 
              value="personal" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-medium">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-dark-surface p-2 rounded-full border border-dark-border shadow-md hover:bg-dark-surface/80 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input
                          id="firstName"
                          defaultValue={user.firstName}
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input
                          id="lastName"
                          defaultValue={user.lastName}
                          className="bg-dark-surface border-dark-border text-light-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input
                        id="username"
                        defaultValue={user.username}
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-dark-border" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contato</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        defaultValue="Brasil"
                        className="bg-dark-surface border-dark-border text-light-text"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Digite sua senha atual"
                      className="bg-dark-surface border-dark-border text-light-text pr-10"
                    />
                    <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Digite sua nova senha"
                      className="bg-dark-surface border-dark-border text-light-text pr-10"
                    />
                    <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      className="bg-dark-surface border-dark-border text-light-text pr-10"
                    />
                    <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Autenticação de Dois Fatores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Status</h4>
                    <p className="text-sm text-muted-foreground">A autenticação de dois fatores está desativada</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-dark-border text-light-text hover:bg-dark-surface"
                  >
                    Ativar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}