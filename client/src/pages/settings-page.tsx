import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Globe, 
  Languages, 
  Mail, 
  Moon, 
  Smartphone, 
  Trash, 
  ShieldAlert 
} from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();

  function handleSaveChanges() {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-1">Personalize sua experiência na plataforma</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Notificações */}
          <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-lg">Notificações</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="emails">Emails</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações por email</p>
                </div>
                <Switch id="emails" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="marketing">Marketing</Label>
                  <p className="text-sm text-muted-foreground">Receba emails com novidades e promoções</p>
                </div>
                <Switch id="marketing" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="push">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                </div>
                <Switch id="push" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Aparência */}
          <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-lg">Aparência</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Tema</Label>
                  <p className="text-sm text-muted-foreground">Aparência da plataforma</p>
                </div>
                <div className="flex items-center bg-dark-surface rounded-md p-1 border border-dark-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-md font-medium bg-primary text-white"
                  >
                    Escuro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Idioma */}
          <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-lg">Idioma e Região</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Idioma</Label>
                  <p className="text-sm text-muted-foreground">Idioma da plataforma</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center border-dark-border text-light-text"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Português (BR)
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Moeda</Label>
                  <p className="text-sm text-muted-foreground">Moeda padrão para exibição</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-dark-border text-light-text"
                >
                  BRL (R$)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade e Segurança */}
          <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-lg">Privacidade e Segurança</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="activity">Atividade de Login</Label>
                  <p className="text-sm text-muted-foreground">Receba alertas sobre atividades suspeitas</p>
                </div>
                <Switch id="activity" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base" htmlFor="cookies">Cookies</Label>
                  <p className="text-sm text-muted-foreground">Aceitar cookies de terceiros</p>
                </div>
                <Switch id="cookies" />
              </div>
            </CardContent>
          </Card>

          {/* Desativar Conta */}
          <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Trash className="h-5 w-5 mr-2 text-negative" />
                <CardTitle className="text-lg text-negative">Desativar Conta</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ao desativar sua conta, todos os seus dados serão removidos permanentemente do sistema.
                Esta ação não pode ser desfeita.
              </p>
              <Button
                variant="destructive"
                className="bg-negative hover:bg-negative/80"
              >
                Desativar Conta
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="bg-primary hover:bg-primary/90"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}