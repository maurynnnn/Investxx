import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
}

export function ProtectedRoute({
  path,
  component: Component,
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

  // Redirecionar usuários admin para dashboard admin quando acessam a rota raiz
  if (user.role === 'admin' && path === '/' && !window.location.pathname.startsWith('/admin')) {
    return (
      <Route path={path}>
        <Redirect to="/admin" />
      </Route>
    );
  }

  // Verificar se um usuário não-admin está tentando acessar rotas de admin
  if (user.role !== 'admin' && path.startsWith('/admin')) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
