import { useState, useEffect, useRef } from "react";
import TopNavigation from "./top-navigation";
import SideNavigation from "./side-navigation";
import Footer from "./footer";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

// Definição da classe Particle fora do componente e do useEffect
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = '#3482F6'; // Cor primária
    this.opacity = Math.random() * 0.5 + 0.1; // Transparência aleatória
  }

  update(width: number, height: number): void {
    this.x += this.speedX;
    this.y += this.speedY;

    // Limites da tela
    if (this.x > width) this.x = 0;
    else if (this.x < 0) this.x = width;

    if (this.y > height) this.y = 0;
    else if (this.y < 0) this.y = height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Partículas animadas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuração de tela em tela cheia
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Configuração das partículas
    const particleCount = 50;
    const particles: Particle[] = [];

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Função de animação
    function animate() {
      if (!ctx || !canvas) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(width, height);
        particles[i].draw(ctx);

        // Desenhar linhas entre partículas próximas
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = '#3482F6';
            ctx.globalAlpha = 0.1 * (1 - distance / 100);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(animate);
    }

    // Iniciar animação
    animate();

    // Redimensionar canvas quando a janela é redimensionada
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-light-text overflow-hidden relative">
      {/* Partículas de fundo */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
      />
      
      {/* Fixed position Top Navigation */}
      <div className="sticky top-0 z-50">
        <TopNavigation onMenuClick={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 relative z-10">
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
