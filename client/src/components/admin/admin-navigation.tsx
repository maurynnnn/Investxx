import { useLocation } from "wouter";
import { Layers, Users, LayoutDashboard, PieChart, CreditCard, Activity, Bell, Settings } from "lucide-react";

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
      className={`flex items-center px-3 py-2 rounded-md my-1 text-sm ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-light-subtext hover:bg-dark-bg hover:text-light-text"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </a>
  );
};

export function AdminNavigation() {
  const [location] = useLocation();

  const adminNavItems = [
    {
      href: "/admin",
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
      href: "/admin/notifications",
      label: "Notificações",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      href: "/admin/settings",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="py-4">
      <div className="px-3 mb-4">
        <h2 className="text-xs font-semibold text-light-subtext uppercase tracking-wider">
          Gerenciamento
        </h2>
      </div>
      <nav className="px-2 space-y-1">
        {adminNavItems.map((item) => (
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