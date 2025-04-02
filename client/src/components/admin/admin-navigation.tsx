import React from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Users, 
  LineChart, 
  BanknoteIcon, 
  Settings, 
  Home,
  GanttChartSquare 
} from "lucide-react";

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({ 
  href, 
  label, 
  icon, 
  active 
}) => {
  const [_, navigate] = useLocation();

  return (
    <li>
      <button
        onClick={() => navigate(href)}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
          active 
            ? "bg-primary/10 text-primary" 
            : "text-light-subtext hover:bg-dark-surface hover:text-light-text"
        )}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

export function AdminNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    {
      href: "/admin",
      label: "Visão Geral",
      icon: <Home className="h-5 w-5" />
    },
    {
      href: "/admin/users",
      label: "Usuários",
      icon: <Users className="h-5 w-5" />
    },
    {
      href: "/admin/investments",
      label: "Investimentos",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      href: "/admin/withdrawals",
      label: "Saques",
      icon: <BanknoteIcon className="h-5 w-5" />
    },
    {
      href: "/admin/plans",
      label: "Planos",
      icon: <GanttChartSquare className="h-5 w-5" />
    },
    {
      href: "/admin/settings",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="bg-dark-card rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-bold text-light-text px-4 mb-4">
        Administração
      </h2>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={location === item.href}
          />
        ))}
      </ul>
    </div>
  );
}