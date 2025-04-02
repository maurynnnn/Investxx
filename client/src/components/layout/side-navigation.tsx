import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/ui/logo";

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string | React.ReactNode;
  currentPath: string;
  onClick: () => void;
  isAdmin?: boolean;
}

const NavItem = ({ href, label, icon, currentPath, onClick, isAdmin = false }: NavItemProps) => {
  const isActive = currentPath === href || (href === "/admin" && currentPath.startsWith("/admin"));
  
  return (
    <Link href={href}>
      <div 
        onClick={onClick}
        className={cn(
          "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
          isActive 
            ? `bg-gradient-to-r ${isAdmin ? 'from-secondary/20 to-secondary/5 text-secondary border-l-2 border-secondary' : 'from-primary/20 to-primary/5 text-primary border-l-2 border-primary'}`
            : `text-light-subtext hover:text-light-text hover:bg-dark-surface/80 hover:border-l-2 ${isAdmin ? 'hover:border-secondary/30' : 'hover:border-primary/30'}`
        )}
      >
        {typeof icon === 'string' ? (
          <i className={`${icon} text-xl mr-3`}></i>
        ) : (
          <span className="mr-3">{icon}</span>
        )}
        <span>{label}</span>
        
        {isAdmin && (
          <span className="ml-auto px-1.5 py-0.5 text-[9px] font-semibold rounded bg-secondary/20 text-secondary">
            ADMIN
          </span>
        )}
      </div>
    </Link>
  );
};

export default function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const navigationItems = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/investments", label: "Investimentos", icon: "ri-funds-line" },
    { href: "/deposits", label: "Depósitos", icon: "ri-money-dollar-circle-line" },
    { href: "/withdrawals", label: "Saques", icon: "ri-bank-card-line" },
    { href: "/referrals", label: "Indicações", icon: "ri-user-add-line" },
  ];

  // Prevenindo rolagem do body quando a sidebar está aberta no modo móvel
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Background overlay no modo móvel */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-16 bottom-0 left-0 z-50 w-72 lg:w-64 xl:w-72 bg-dark-surface/95 backdrop-blur-sm border-r border-dark-border transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full overflow-auto">
          {/* Logo and Close Button */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
            <Link href="/">
              <div className="cursor-pointer">
                <Logo size="small" withText={true} />
              </div>
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
            
            {isAdmin && (
              <>
                <div className="my-4 px-4">
                  <h3 className="text-xs font-medium text-secondary uppercase tracking-wider">Administração</h3>
                </div>
                <NavItem
                  href="/admin"
                  label="Painel Admin"
                  icon={<ShieldCheck className="h-5 w-5 text-secondary" />}
                  currentPath={location}
                  onClick={onClose}
                  isAdmin={true}
                />
                <NavItem
                  href="/admin/users"
                  label="Usuários"
                  icon="ri-user-settings-line"
                  currentPath={location}
                  onClick={onClose}
                  isAdmin={true}
                />
                <NavItem
                  href="/admin/investments"
                  label="Investimentos"
                  icon="ri-line-chart-line"
                  currentPath={location}
                  onClick={onClose}
                  isAdmin={true}
                />
                <NavItem
                  href="/admin/withdrawals"
                  label="Aprovar Saques"
                  icon="ri-money-dollar-box-line"
                  currentPath={location}
                  onClick={onClose}
                  isAdmin={true}
                />
                <NavItem
                  href="/admin/plans"
                  label="Gerenciar Planos"
                  icon="ri-funds-box-line"
                  currentPath={location}
                  onClick={onClose}
                  isAdmin={true}
                />
              </>
            )}
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
              <Button 
                onClick={() => {
                  onClose();
                  window.location.href = "/support";
                }}
                className="w-full py-2 px-3 text-sm bg-primary hover:bg-primary/90 text-white"
              >
                Fale com o Suporte
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
