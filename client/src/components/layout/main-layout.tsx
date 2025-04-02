import { useState } from "react";
import TopNavigation from "./top-navigation";
import SideNavigation from "./side-navigation";
import Footer from "./footer";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-light-text">
      {/* Fixed position Top Navigation */}
      <div className="sticky top-0 z-50">
        <TopNavigation onMenuClick={toggleSidebar} />
      </div>
      
      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <SideNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-grow px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto transition-all duration-300">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
