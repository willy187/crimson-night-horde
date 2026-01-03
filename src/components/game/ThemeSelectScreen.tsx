import React, { useEffect, useRef } from 'react';
import { GameTheme } from '@/types/game';
import { useI18n } from '@/hooks/useI18n';
import { Cat, Rocket } from 'lucide-react';

interface ThemeSelectScreenProps {
  onSelectTheme: (theme: GameTheme) => void;
}

export const ThemeSelectScreen: React.FC<ThemeSelectScreenProps> = ({ onSelectTheme }) => {
  const { t } = useI18n();
  const catCanvasRef = useRef<HTMLCanvasElement>(null);
  const spaceCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw preview on canvas
  useEffect(() => {
    // Cat preview
    const catCanvas = catCanvasRef.current;
    if (catCanvas) {
      const ctx = catCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 100, 100);
        
        // Draw cat
        const x = 50, y = 50, size = 18;
        ctx.fillStyle = 'hsl(35, 70%, 60%)';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.9, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'hsl(35, 70%, 65%)';
        ctx.beginPath();
        ctx.arc(x + size * 0.5, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.fillStyle = 'hsl(35, 70%, 55%)';
        ctx.beginPath();
        ctx.moveTo(x + size * 0.6, y - size * 0.25);
        ctx.lineTo(x + size * 0.8, y - size * 0.7);
        ctx.lineTo(x + size * 1, y - size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + size * 0.6, y + size * 0.25);
        ctx.lineTo(x + size * 0.8, y + size * 0.7);
        ctx.lineTo(x + size * 1, y + size * 0.2);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + size * 0.5, y - size * 0.12, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.5, y + size * 0.12, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'hsl(120, 60%, 35%)';
        ctx.beginPath();
        ctx.arc(x + size * 0.55, y - size * 0.12, size * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.55, y + size * 0.12, size * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Space preview
    const spaceCanvas = spaceCanvasRef.current;
    if (spaceCanvas) {
      const ctx = spaceCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 100, 100);
        
        const x = 50, y = 50, size = 20;
        
        // Ship body
        ctx.fillStyle = 'hsl(210, 30%, 50%)';
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x - size * 0.7, y - size * 0.6);
        ctx.lineTo(x - size * 0.5, y);
        ctx.lineTo(x - size * 0.7, y + size * 0.6);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = 'hsl(180, 80%, 60%)';
        ctx.beginPath();
        ctx.ellipse(x + size * 0.2, y, size * 0.3, size * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Flame
        ctx.fillStyle = 'hsl(30, 100%, 60%)';
        ctx.beginPath();
        ctx.moveTo(x - size * 0.5, y - size * 0.15);
        ctx.lineTo(x - size * 1, y);
        ctx.lineTo(x - size * 0.5, y + size * 0.15);
        ctx.closePath();
        ctx.fill();
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
      <div className="text-center space-y-8 p-6">
        <h1 className="text-4xl font-bold text-primary animate-pulse">
          {t('selectTheme')}
        </h1>
        
        <div className="flex gap-8 justify-center">
          {/* Cat Theme */}
          <button
            onClick={() => onSelectTheme('cat')}
            className="group relative bg-card/80 border-2 border-border hover:border-primary rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 w-64"
          >
            <div className="flex justify-center mb-4">
              <canvas
                ref={catCanvasRef}
                width={100}
                height={100}
                className="rounded-lg bg-background/50"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cat className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{t('catTheme')}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{t('catThemeDesc')}</p>
          </button>
          
          {/* Space Theme */}
          <button
            onClick={() => onSelectTheme('space')}
            className="group relative bg-card/80 border-2 border-border hover:border-primary rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 w-64"
          >
            <div className="flex justify-center mb-4">
              <canvas
                ref={spaceCanvasRef}
                width={100}
                height={100}
                className="rounded-lg bg-background/50"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Rocket className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{t('spaceTheme')}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{t('spaceThemeDesc')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
