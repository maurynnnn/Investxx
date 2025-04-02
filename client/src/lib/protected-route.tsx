import { useAuth } from "@/hooks/use-auth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
  userOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-dark-bg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Verificar se a rota é apenas para admin
  if (adminOnly && user.role !== 'admin') {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-dark-bg">
          <ShieldAlert className="h-16 w-16 text-negative mb-4" />
          <h1 className="text-2xl font-bold text-light-text mb-2">Acesso Restrito</h1>
          <p className="text-light-subtext mb-6 max-w-md">
            Esta área é restrita para administradores do sistema. Você não tem permissão para acessar este conteúdo.
          </p>
          <a 
            href="/" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Voltar para o Dashboard
          </a>
        </div>
      </Route>
    );
  }

  // Verificar se a rota é apenas para usuários comuns
  if (userOnly && user.role === 'admin') {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-dark-bg">
          <ShieldAlert className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-light-text mb-2">Área de Usuários</h1>
          <p className="text-light-subtext mb-6 max-w-md">
            Como administrador, você deve acessar o painel administrativo dedicado. Esta área é destinada apenas para usuários comuns.
          </p>
          <a 
            href="/admin" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Ir para o Painel Admin
          </a>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
