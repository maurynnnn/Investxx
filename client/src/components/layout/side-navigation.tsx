import { useLocation, Link } from "wouter";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const navigationItems = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/investments", label: "Investimentos", icon: "ri-funds-line" },
    { href: "/deposits", label: "Depósitos", icon: "ri-money-dollar-circle-line" },
    { href: "/withdrawals", label: "Saques", icon: "ri-bank-card-line" },
    { href: "/referrals", label: "Indicações", icon: "ri-user-add-line" },
  ];

  // Admin items se o usuário for admin
  const adminItems = isAdmin ? [
    { href: "/admin", label: "Painel Admin", icon: <ShieldCheck className="h-5 w-5" /> },
    { href: "/admin/users", label: "Usuários", icon: "ri-user-settings-line" },
    { href: "/admin/withdrawals", label: "Aprovações", icon: "ri-secure-payment-line" }
  ] : [];

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
  
  // Efeito para animar partículas no background da sidebar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajustando o tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Criar partículas
    const particlesArray: Particle[] = [];
    const numberOfParticles = 40;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = isAdmin ? 
          `rgba(${Math.random() * 20 + 130}, ${Math.random() * 30 + 160}, ${Math.random() * 60 + 190}, ${Math.random() * 0.5 + 0.1})` : 
          `rgba(${Math.random() * 40 + 110}, ${Math.random() * 30 + 90}, ${Math.random() * 60 + 200}, ${Math.random() * 0.5 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebater na borda
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    init();
    
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAdmin, isOpen]);

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
          {/* Canvas para partículas animadas e botão de fechar */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border relative overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 z-0 w-full h-full"
            />
            <div className="font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 z-10">
              <span className="ml-2 uppercase tracking-wider text-sm font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {isAdmin ? 'Admin Panel' : 'Menu'}
              </span>
            </div>
            <Button 
              variant="ghost"
              size="icon"
              className="lg:hidden text-light-subtext hover:text-light-text z-10"
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
            
            {/* Itens de navegação do admin */}
            {isAdmin && adminItems.length > 0 && (
              <>
                <div className="mt-6 mb-4 px-4">
                  <h3 className="text-xs font-medium text-secondary uppercase tracking-wider">Administração</h3>
                </div>
                {adminItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    currentPath={location}
                    onClick={onClose}
                    isAdmin={true}
                  />
                ))}
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
