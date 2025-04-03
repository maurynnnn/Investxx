import { useLocation } from "wouter";
import { Layers, Users, LayoutDashboard, PieChart, CreditCard, Activity, Bell, Settings, CircleDot } from "lucide-react";

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const AdminNavItem = ({ href, label, icon, active }: AdminNavItemProps) => {
  const [_, navigate] = useLocation();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      className={`relative flex items-center px-3 py-2.5 rounded-md my-1 text-sm transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-light-subtext hover:bg-dark-bg hover:text-light-text"
      }`}
    >
      {/* Indicador lateral quando ativo */}
      {active && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></span>
      )}
      
      <span className={`mr-3 transition-colors ${active ? "text-primary" : "text-light-subtext group-hover:text-light-text"}`}>
        {icon}
      </span>
      
      <span className="flex-1">{label}</span>
      
      {/* Indicador de status ativo */}
      {active && (
        <CircleDot className="h-3 w-3 ml-2 text-primary opacity-70" />
      )}
    </a>
  );
};

export function AdminNavigation() {
  const [location] = useLocation();

  // Grupos de navegação para melhor organização
  const mainNavItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Usuários",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/plans",
      label: "Planos de Investimento",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      href: "/admin/withdrawals",
      label: "Saques Pendentes",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];
  
  const analysisNavItems = [
    {
      href: "/admin/statistics",
      label: "Estatísticas",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      href: "/admin/transactions",
      label: "Transações",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      href: "/admin/transactions",
      label: "Transações",
      icon: <Activity className="h-5 w-5" />,
    },
  ];
  
  const systemNavItems = [
    {
      href: "/admin/settings",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="py-4 overflow-y-auto">
      {/* Navegação Principal */}
      <div className="px-3 mb-3">
        <div className="flex items-center">
          <div className="h-0.5 w-4 bg-primary/50 rounded-full mr-2"></div>
          <h2 className="text-xs font-bold text-light-subtext uppercase tracking-wider">
            Gerenciamento
          </h2>
          <div className="h-0.5 flex-1 bg-dark-border ml-2"></div>
        </div>
      </div>
      <nav className="px-2 space-y-0.5 mb-6">
        {mainNavItems.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={location === item.href}
          />
        ))}
      </nav>
      
      {/* Análise e Relatórios */}
      <div className="px-3 mb-3">
        <div className="flex items-center">
          <div className="h-0.5 w-4 bg-primary/50 rounded-full mr-2"></div>
          <h2 className="text-xs font-bold text-light-subtext uppercase tracking-wider">
            Análise
          </h2>
          <div className="h-0.5 flex-1 bg-dark-border ml-2"></div>
        </div>
      </div>
      <nav className="px-2 space-y-0.5 mb-6">
        {analysisNavItems.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={location === item.href}
          />
        ))}
      </nav>
      
      {/* Sistema */}
      <div className="px-3 mb-3">
        <div className="flex items-center">
          <div className="h-0.5 w-4 bg-primary/50 rounded-full mr-2"></div>
          <h2 className="text-xs font-bold text-light-subtext uppercase tracking-wider">
            Sistema
          </h2>
          <div className="h-0.5 flex-1 bg-dark-border ml-2"></div>
        </div>
      </div>
      <nav className="px-2 space-y-0.5 mb-6">
        {systemNavItems.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={location === item.href}
          />
        ))}
      </nav>
    </div>
  );
}