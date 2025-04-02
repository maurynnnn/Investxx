import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  currentPath: string;
  onClick: () => void;
}

const NavItem = ({ href, label, icon, currentPath, onClick }: NavItemProps) => {
  const isActive = currentPath === href;
  
  return (
    <Link href={href}>
      <a 
        onClick={onClick}
        className={cn(
          "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
          isActive 
            ? "bg-primary/20 text-primary" 
            : "text-light-subtext hover:text-light-text hover:bg-dark-surface"
        )}
      >
        <i className={`${icon} text-xl mr-3`}></i>
        <span>{label}</span>
      </a>
    </Link>
  );
};

export default function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const [location] = useLocation();
  
  const navigationItems = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/investments", label: "Investimentos", icon: "ri-funds-line" },
    { href: "/deposits", label: "Depósitos", icon: "ri-money-dollar-circle-line" },
    { href: "/withdrawals", label: "Saques", icon: "ri-bank-card-line" },
    { href: "/referrals", label: "Indicações", icon: "ri-user-add-line" },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-dark-surface border-r border-dark-border transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full overflow-auto">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          <div className="flex items-center">
            <i className="ri-line-chart-fill text-2xl text-primary mr-2"></i>
            <span className="font-display font-bold text-xl text-light-text">InvestX</span>
          </div>
          <button 
            className="lg:hidden text-light-subtext hover:text-light-text"
            onClick={onClose}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              currentPath={location}
              onClick={onClose}
            />
          ))}
        </nav>
        
        {/* Help & Support */}
        <div className="p-4 border-t border-dark-border">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center mb-3">
              <i className="ri-customer-service-2-line text-primary text-xl mr-2"></i>
              <h3 className="font-medium text-light-text">Precisa de ajuda?</h3>
            </div>
            <p className="text-sm text-light-subtext mb-3">
              Nossa equipe está disponível para ajudar com qualquer dúvida.
            </p>
            <button className="w-full py-2 px-3 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Suporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
