
import { AdminLayout } from "../../components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { useToast } from "../../hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();

  return (
    <AdminLayout title="Configurações" subtitle="Configurações gerais da plataforma">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Manutenção Programada</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Novos Registros</span>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <span>Taxa de Saque (%)</span>
              <Input type="number" placeholder="2.5" />
            </div>
            <Button onClick={() => {
              toast({
                title: "Configurações salvas",
                description: "As configurações foram atualizadas com sucesso"
              });
            }}>
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
