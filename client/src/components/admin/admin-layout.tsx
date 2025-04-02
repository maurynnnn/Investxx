import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { 
  ChevronLeft, 
  Menu, 
  X, 
  Home,
  LogOut,
  ChevronRight 
} from "lucide-react";
import { AdminNavigation } from "./admin-navigation";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [_, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  const isMobile = useMobile();

  // Detectar scroll para aplicar estilos adicionais ao header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Impedir a rolagem do body quando o menu mobile estiver aberto
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToApp = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      {/* Admin Header */}
      <header 
        className={`sticky top-0 z-50 border-b border-dark-border bg-dark-component shadow-sm transition-all ${
          scrolled ? "bg-opacity-95 backdrop-blur-sm" : ""
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center">
              <span className="hidden md:inline-block font-bold text-primary text-xl mr-2">InvestX</span>
              <span className="text-sm md:text-base font-medium text-light-text">Painel Administrativo</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 hidden md:flex"
              onClick={handleBackToApp}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar ao App
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={handleLogout}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar - Desktop Version */}
        <aside className={`hidden md:block w-64 shrink-0 border-r border-dark-border bg-dark-component sticky top-16 self-start h-[calc(100vh-4rem)]`}>
          <div className="h-full overflow-y-auto scrollbar-thin">
            <AdminNavigation />
          </div>
        </aside>

        {/* Admin Sidebar - Mobile Version */}
        {isMobile && (
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform border-r border-dark-border bg-dark-component transition-transform duration-300 ease-in-out overflow-hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-16 items-center justify-between border-b border-dark-border p-4 bg-dark-component sticky top-0 z-10">
              <div className="font-bold text-primary text-xl">InvestX Admin</div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              <AdminNavigation />
            </div>
            <div className="absolute bottom-0 w-full p-4 border-t border-dark-border bg-dark-component">
              <Button
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={handleBackToApp}
              >
                <Home className="mr-2 h-4 w-4" />
                Voltar ao App
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-negative hover:text-negative"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </aside>
        )}

        {/* Mobile backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-dark-bg/80 backdrop-blur-sm"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container p-4 md:p-6">
            <div className={`mb-6 sticky top-0 z-10 pt-2 pb-4 ${
              scrolled ? "bg-dark-bg bg-opacity-95 backdrop-blur-sm border-b border-dark-border" : ""
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-light-text">{title}</h1>
                  {subtitle && <p className="text-light-subtext">{subtitle}</p>}
                </div>
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToApp}
                    className="flex items-center"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    App
                  </Button>
                )}
              </div>
              <div className="mt-2 flex items-center text-xs text-light-subtext">
                <a href="/admin" className="hover:text-primary">Dashboard</a>
                <ChevronRight className="mx-1 h-3 w-3" />
                <span className="font-medium text-light-text">{title}</span>
              </div>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}