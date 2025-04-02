import { useState } from "react";
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
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  Menu 
} from "lucide-react";

interface TopNavigationProps {
  onMenuClick: () => void;
}

export default function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const navigationLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/investments", label: "Investimentos" },
    { href: "/deposits", label: "Depósitos" },
    { href: "/withdrawals", label: "Saques" },
    { href: "/referrals", label: "Indicações" },
  ];
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle a class on the html/body element
    // or update a context that controls the theme
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <nav className="bg-dark-surface border-b border-dark-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button */}
            <div className="flex-shrink-0 -ml-2 -mr-2 lg:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMenuClick}
                className="text-light-subtext hover:text-light-text"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <i className="ri-line-chart-fill text-2xl text-primary mr-2"></i>
                  <span className="font-display font-bold text-xl text-light-text hidden sm:block">InvestX</span>
                </a>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className={`
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    ${location === link.href 
                      ? 'border-primary text-light-text' 
                      : 'border-transparent text-light-subtext hover:border-secondary hover:text-light-text'}
                  `}>
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative text-light-subtext hover:text-light-text"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
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
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="ml-3 text-light-subtext hover:text-light-text"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost"
                  className="ml-3 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="font-medium">{getInitials()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-dark-card border-dark-border">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-light-text">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-light-subtext truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-dark-border" />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/support")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Suporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-dark-border" />
                <DropdownMenuItem className="cursor-pointer text-negative" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
