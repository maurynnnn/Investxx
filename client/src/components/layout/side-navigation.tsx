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

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particles: any[] = [];

    const init = () => {
      canvas.className = 'absolute inset-0 pointer-events-none opacity-30';
      document.querySelector('aside')?.appendChild(canvas);

      const resize = () => {
        const aside = document.querySelector('aside');
        if (aside) {
          canvas.width = aside.clientWidth;
          canvas.height = aside.clientHeight;
        }
      };

      resize();
      window.addEventListener('resize', resize);

      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1
        });
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x > canvas.width) particle.x = 0;
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.y > canvas.height) particle.y = 0;
          if (particle.y < 0) particle.y = canvas.height;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 130, 246, ${particle.opacity})`;
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resize);
        canvas.remove();
      };
    };

    init();
  }, []);

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
          {/* Header with Menu Title and Close Button */}
          <div className="h-16 flex items-center justify-between px-4">
            <h3 className="text-sm font-semibold text-light-text uppercase tracking-[0.15em]">Menu Principal</h3>
            <Button 
              variant="ghost"
              size="icon"
              className="text-light-subtext hover:text-light-text"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
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