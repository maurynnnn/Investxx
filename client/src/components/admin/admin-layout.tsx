import React from "react";
import { useLocation } from "wouter";
import { AdminNavigation } from "./admin-navigation";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Bell, 
  Settings,
  User, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ 
  children,
  title,
  subtitle 
}: AdminLayoutProps) {
  const [_, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      }
    });
  };

  const getUserInitials = () => {
    if (!user) return "?";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  return (
    <div className="min-h-screen bg-dark-background">
      {/* Header */}
      <header className="bg-dark-card shadow-sm py-4 px-6 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="text-light-text hover:bg-dark-surface"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <h1 className="text-xl font-bold text-light-text">
                Painel Administrativo
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-light-subtext">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 bg-dark-card border-dark-border" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm text-light-text">{user?.firstName} {user?.lastName}</p>
                    <p className="w-[200px] truncate text-xs text-light-subtext">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-dark-border" />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center p-2 hover:bg-dark-surface rounded-md transition-colors duration-150" 
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
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
                <DropdownMenuSeparator className="bg-dark-border" />
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors duration-150" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="pt-24 pb-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AdminNavigation />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-dark-card rounded-xl p-6 shadow-sm mb-6">
              <h1 className="text-2xl font-bold text-light-text">{title}</h1>
              {subtitle && (
                <p className="text-light-subtext mt-1">{subtitle}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}