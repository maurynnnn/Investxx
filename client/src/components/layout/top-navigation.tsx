import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  Menu,
  CreditCard,
  BarChart3,
  ShieldCheck
} from "lucide-react";
import Logo from "@/components/ui/logo";

interface TopNavigationProps {
  onMenuClick: () => void;
}

export default function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  
  const navigationLinks = [
    { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { href: "/investments", label: "Investimentos", icon: "ri-funds-line" },
    { href: "/deposits", label: "Depósitos", icon: "ri-money-dollar-circle-line" },
    { href: "/withdrawals", label: "Saques", icon: "ri-bank-card-line" },
    { href: "/referrals", label: "Indicações", icon: "ri-user-add-line" },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const isAdmin = user?.role === 'admin';

  // Detectar o scroll para efeitos de animação
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Animar header ao carregar
    setTimeout(() => {
      setAnimateHeader(true);
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`${
        scrolled 
          ? 'bg-dark-surface/95 shadow-lg' 
          : 'bg-dark-surface/70'
      } border-b border-dark-border backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="flex-shrink-0 -ml-2 lg:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMenuClick}
                className="text-light-subtext hover:text-light-text transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Nova Logo com animação */}
            <div 
              className={`flex-shrink-0 flex items-center transform ${
                animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              } transition-all duration-500 ease-out`}
            >
              <Link href="/">
                <div className="cursor-pointer">
                  <Logo size="medium" withText={true} />
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation Links com animação */}
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navigationLinks.map((link, idx) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={`
                      inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium cursor-pointer
                      transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
                      transition-all duration-500 ease-out
                      ${location === link.href 
                        ? 'border-primary text-light-text' 
                        : 'border-transparent text-light-subtext hover:border-secondary hover:text-light-text'}
                    `}
                    style={{ transitionDelay: `${150 + idx * 75}ms` }}
                  >
                    <i className={`${link.icon} mr-1.5`}></i>
                    {link.label}
                  </span>
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin">
                  <span 
                    className={`
                      inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium cursor-pointer
                      transform ${animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
                      transition-all duration-500 ease-out bg-primary/10 rounded-t-md 
                      ${location.startsWith('/admin') 
                        ? 'border-primary text-light-text' 
                        : 'border-transparent text-light-subtext hover:border-secondary hover:text-light-text'}
                    `}
                    style={{ transitionDelay: `${150 + navigationLinks.length * 75}ms` }}
                  >
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                    Admin
                  </span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side actions com animação */}
          <div 
            className={`flex items-center transform ${
              animateHeader ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            } transition-all duration-500 ease-out`}
            style={{ transitionDelay: '400ms' }}
          >
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative text-light-subtext hover:text-light-text hover:bg-dark-surface/80 transition-colors duration-300"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-dark-card border-dark-border">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-dark-border" />
                <div className="py-2 px-4 text-center text-light-subtext text-sm">
                  Nenhuma notificação no momento
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className="ml-3 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary hover:bg-dark-surface/80 transition-colors duration-300"
                >
                  <div className={`h-8 w-8 rounded-full ${isAdmin ? 'bg-gradient-to-br from-secondary to-primary' : 'bg-gradient-to-br from-primary to-primary/80'} text-white flex items-center justify-center group-hover:from-primary/80 group-hover:to-primary transition-all duration-300`}>
                    <span className="font-medium">{getInitials()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-dark-card border-dark-border">
                <div className="p-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-dark-surface/80 to-dark-surface/20">
                    <div className={`h-12 w-12 rounded-full ${isAdmin ? 'bg-gradient-to-br from-secondary to-primary' : 'bg-gradient-to-br from-primary to-primary/70'} text-white flex items-center justify-center`}>
                      <span className="font-medium text-base">{getInitials()}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-light-text">{user?.firstName} {user?.lastName}</p>
                        {isAdmin && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-secondary/20 text-secondary">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-light-subtext truncate max-w-[150px]">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-dark-border" />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                    onClick={() => navigate("/transactions")}
                  >
                    <BarChart3 className="mr-3 h-4 w-4" />
                    <span>Minhas Transações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                    onClick={() => navigate("/payment-methods")}
                  >
                    <CreditCard className="mr-3 h-4 w-4" />
                    <span>Métodos de Pagamento</span>
                  </DropdownMenuItem>
                </div>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-dark-border" />
                    <div className="p-1">
                      <DropdownMenuItem 
                        className="cursor-pointer flex items-center p-2 hover:bg-secondary/10 rounded-md transition-colors duration-150" 
                        onClick={() => navigate("/admin")}
                      >
                        <ShieldCheck className="mr-3 h-4 w-4 text-secondary" />
                        <span>Painel de Administração</span>
                      </DropdownMenuItem>
                    </div>
                  </>
                )}
                <DropdownMenuSeparator className="bg-dark-border" />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                    onClick={() => navigate("/support")}
                  >
                    <HelpCircle className="mr-3 h-4 w-4" />
                    <span>Suporte</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-dark-border" />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center p-2 hover:bg-negative/20 text-negative rounded-md transition-colors duration-150" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
