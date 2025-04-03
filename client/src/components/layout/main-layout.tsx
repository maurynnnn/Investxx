import { useState, useEffect, useRef } from "react";
import TopNavigation from "./top-navigation";
import SideNavigation from "./side-navigation";
import Footer from "./footer";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

class NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;

  constructor(width: number, height: number, color: string = '#3482F6') {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.color = color;
  }

  update(width: number, height: number): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D, nodes: NetworkNode[], maxDistance: number = 150): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    nodes.forEach(node => {
      const dx = this.x - node.x;
      const dy = this.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.2 * (1 - distance / maxDistance);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }
}

export default function MainLayout({ children, isAdmin = false }: MainLayoutProps) {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const primaryColor = isAdmin ? '#12B7E2' : '#3482F6';
    const secondaryColor = isAdmin ? '#6C63FF' : '#3482F6';

    const nodeCount = 30;
    const nodes: NetworkNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const color = isAdmin && i % 2 === 0 ? secondaryColor : primaryColor;
      nodes.push(new NetworkNode(canvas.width, canvas.height, color));
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(node => {
        node.update(canvas.width, canvas.height);
        node.draw(ctx, nodes);
      });

      requestAnimationFrame(animate);
    }

    animate();

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
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
      />

      <TopNavigation onMenuClick={toggleSidebar} />

      <div className="h-16"></div>

      <div className="flex flex-1 relative z-10">
        <SideNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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