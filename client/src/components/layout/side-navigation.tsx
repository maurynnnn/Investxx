import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-l-2 border-primary" 
            : "text-light-subtext hover:text-light-text hover:bg-dark-surface/80 hover:border-l-2 hover:border-primary/30"
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
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-72 bg-dark-surface/95 backdrop-blur-sm border-r border-dark-border transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full overflow-auto">
        {/* Logo and Close Button */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          <Link href="/">
            <a className="flex items-center">
              <i className="ri-line-chart-fill text-2xl text-primary mr-2"></i>
              <span className="font-display font-bold text-xl text-light-text">InvestX</span>
            </a>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            className="lg:hidden text-light-subtext hover:text-light-text"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-4 px-4">
            <h3 className="text-xs font-medium text-light-subtext uppercase tracking-wider">Menu Principal</h3>
          </div>
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
        <div className="p-4 border-t border-dark-border mt-auto">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <div className="flex items-center mb-3">
              <HelpCircle className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium text-light-text">Precisa de ajuda?</h3>
            </div>
            <p className="text-sm text-light-subtext mb-3">
              Nossa equipe está disponível 24/7 para resolver suas dúvidas.
            </p>
            <Button className="w-full py-2 px-3 text-sm bg-primary hover:bg-primary/90 text-white">
              Fale com o Suporte
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
