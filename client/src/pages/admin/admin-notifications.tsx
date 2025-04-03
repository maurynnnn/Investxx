
import { AdminLayout } from "@/components/admin/admin-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  read: boolean;
}

export default function AdminNotifications() {
  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/admin/notifications"],
    placeholderData: [
      {
        id: 1,
        title: "Novo saque pendente",
        message: "Há um novo saque aguardando aprovação",
        type: "warning",
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: 2,
        title: "Novo usuário registrado",
        message: "Um novo usuário se cadastrou na plataforma",
        type: "info",
        createdAt: new Date().toISOString(),
        read: false
      }
    ]
  });

  return (
    <AdminLayout title="Notificações" subtitle="Gerencie as notificações do sistema">
      <div className="space-y-4">
        {notifications?.map((notification) => (
          <Card key={notification.id} className={`border-l-4 ${
            notification.type === 'warning' ? 'border-l-amber-500' :
            notification.type === 'success' ? 'border-l-emerald-500' :
            notification.type === 'error' ? 'border-l-red-500' :
            'border-l-blue-500'
          }`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {notification.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDate(new Date(notification.createdAt))}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
