import { useState, useEffect, useRef } from "react";
import TopNavigation from "./top-navigation";
import SideNavigation from "./side-navigation";
import Footer from "./footer";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
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

  constructor(width: number, height: number, color: string = '#3482F6') {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = color; // Cor primária ou secundária (admin)
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

export default function MainLayout({ children, isAdmin = false }: MainLayoutProps) {
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

    // Cores baseadas no modo (normal ou admin)
    const primaryColor = isAdmin ? '#12B7E2' : '#3482F6'; // Azul secundário para admin
    const secondaryColor = isAdmin ? '#6C63FF' : '#3482F6'; // Roxo primário para admin

    // Configuração das partículas
    const particleCount = 50;
    const particles: Particle[] = [];

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      // Alterna entre cores primárias e secundárias para admin
      const color = isAdmin && i % 2 === 0 ? secondaryColor : primaryColor;
      particles.push(new Particle(canvas.width, canvas.height, color));
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
            ctx.strokeStyle = particles[i].color;
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
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-light-text overflow-hidden relative">
      {/* Partículas de fundo */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
      />
      
      {/* Top Navigation - fixo */}
      <TopNavigation onMenuClick={toggleSidebar} />
      
      {/* Espaçador para compensar o header fixo */}
      <div className="h-16"></div>
      
      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <SideNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className={`flex-grow px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full mx-auto transition-all duration-300 ${isAdmin ? 'lg:pl-64 xl:pl-72' : ''}`}>
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
