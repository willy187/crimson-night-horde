import React, { useEffect, useRef } from 'react';
import { GameState } from '@/types/game';
import { 
  drawCatPlayer, 
  drawMouseEnemy, 
  drawSpaceshipPlayer, 
  drawAlienShip,
  drawThemedProjectile
} from '@/utils/themeRenderer';

interface GameCanvasProps {
  gameState: GameState;
  canvasWidth: number;
  canvasHeight: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  canvasWidth,
  canvasHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = gameState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with theme-appropriate background
    if (theme === 'cat') {
      ctx.fillStyle = 'hsl(30, 20%, 15%)';
    } else {
      ctx.fillStyle = 'hsl(240, 10%, 4%)';
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = theme === 'cat' ? 'hsl(30, 15%, 20%)' : 'hsl(240, 10%, 10%)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw power-ups
    gameState.powerUps.forEach((powerUp) => {
      ctx.save();
      const pulseScale = 1 + Math.sin(gameState.gameTime * 5) * 0.15;
      const size = 18 * pulseScale;
      
      // Glow effect
      ctx.shadowBlur = 20;
      
      if (powerUp.type === 'shield') {
        // Shield - cyan bubble
        ctx.shadowColor = 'hsl(180, 100%, 50%)';
        const gradient = ctx.createRadialGradient(powerUp.x, powerUp.y, 0, powerUp.x, powerUp.y, size);
        gradient.addColorStop(0, 'hsla(180, 100%, 80%, 0.9)');
        gradient.addColorStop(0.6, 'hsla(180, 100%, 50%, 0.7)');
        gradient.addColorStop(1, 'hsla(180, 100%, 40%, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, size, 0, Math.PI * 2);
        ctx.fill();
        // Shield icon
        ctx.fillStyle = 'white';
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛡️', powerUp.x, powerUp.y);
      } else if (powerUp.type === 'magnet') {
        // Magnet - purple magnetic
        ctx.shadowColor = 'hsl(280, 100%, 50%)';
        const gradient = ctx.createRadialGradient(powerUp.x, powerUp.y, 0, powerUp.x, powerUp.y, size);
        gradient.addColorStop(0, 'hsla(280, 100%, 80%, 0.9)');
        gradient.addColorStop(0.6, 'hsla(280, 100%, 50%, 0.7)');
        gradient.addColorStop(1, 'hsla(280, 100%, 40%, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, size, 0, Math.PI * 2);
        ctx.fill();
        // Magnet icon
        ctx.fillStyle = 'white';
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧲', powerUp.x, powerUp.y);
      } else if (powerUp.type === 'bomb') {
        // Bomb - orange/red explosive
        ctx.shadowColor = 'hsl(30, 100%, 50%)';
        const gradient = ctx.createRadialGradient(powerUp.x, powerUp.y, 0, powerUp.x, powerUp.y, size);
        gradient.addColorStop(0, 'hsla(45, 100%, 70%, 0.9)');
        gradient.addColorStop(0.6, 'hsla(30, 100%, 50%, 0.7)');
        gradient.addColorStop(1, 'hsla(15, 100%, 40%, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, size, 0, Math.PI * 2);
        ctx.fill();
        // Bomb icon
        ctx.fillStyle = 'white';
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', powerUp.x, powerUp.y);
      }
      ctx.restore();
    });

    // Draw XP gems
    gameState.xpGems.forEach((gem) => {
      ctx.save();
      if (theme === 'cat') {
        // Fish-like gem for cat theme
        ctx.shadowColor = 'hsl(200, 80%, 60%)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'hsl(200, 80%, 60%)';
      } else {
        ctx.shadowColor = 'hsl(45, 100%, 51%)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'hsl(45, 100%, 51%)';
      }
      ctx.beginPath();
      
      // Diamond shape
      ctx.moveTo(gem.x, gem.y - 8);
      ctx.lineTo(gem.x + 6, gem.y);
      ctx.lineTo(gem.x, gem.y + 8);
      ctx.lineTo(gem.x - 6, gem.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Draw projectiles with theme
    gameState.projectiles.forEach((proj) => {
      const angle = Math.atan2(proj.vy, proj.vx);
      drawThemedProjectile(ctx, proj.x, proj.y, proj.size, theme, angle);
    });

    // Draw enemies with theme
    gameState.enemies.forEach((enemy) => {
      if (theme === 'cat') {
        drawMouseEnemy(ctx, enemy);
      } else {
        drawAlienShip(ctx, enemy);
      }
    });

    // Draw explosions
    gameState.explosions.forEach((explosion) => {
      const progress = (gameState.gameTime - explosion.startTime) / explosion.duration;
      if (progress >= 1) return;
      
      ctx.save();
      const alpha = 1 - progress;
      const currentSize = explosion.size * (0.5 + progress * 1.5);
      
      if (explosion.isOrbital) {
        // Orbital explosion - purple spiral effect
        const rotationOffset = progress * Math.PI * 4;
        
        ctx.strokeStyle = `hsla(280, 100%, 60%, ${alpha * 0.8})`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = `hsla(200, 100%, 60%, ${alpha * 0.6})`;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        const innerGradient = ctx.createRadialGradient(
          explosion.x, explosion.y, 0,
          explosion.x, explosion.y, currentSize * 0.5
        );
        innerGradient.addColorStop(0, `hsla(280, 100%, 90%, ${alpha})`);
        innerGradient.addColorStop(0.4, `hsla(280, 100%, 70%, ${alpha * 0.6})`);
        innerGradient.addColorStop(1, 'hsla(280, 100%, 50%, 0)');
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        const particleCount = 10;
        for (let i = 0; i < particleCount; i++) {
          const baseAngle = (i / particleCount) * Math.PI * 2;
          const spiralAngle = baseAngle + rotationOffset;
          const particleDist = currentSize * (0.3 + progress * 0.8);
          const px = explosion.x + Math.cos(spiralAngle) * particleDist;
          const py = explosion.y + Math.sin(spiralAngle) * particleDist;
          const particleSize = 5 * (1 - progress);
          
          const hue = i % 2 === 0 ? 280 : 200;
          ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        for (let i = 0; i < 6; i++) {
          const baseAngle = (i / 6) * Math.PI * 2;
          const spiralAngle = baseAngle - rotationOffset * 0.5;
          const particleDist = currentSize * (0.8 + progress * 0.4);
          const px = explosion.x + Math.cos(spiralAngle) * particleDist;
          const py = explosion.y + Math.sin(spiralAngle) * particleDist;
          const particleSize = 3 * (1 - progress);
          
          ctx.fillStyle = `hsla(50, 100%, 70%, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Normal explosion - theme colored
        const explosionHue = theme === 'cat' ? 30 : 0;
        
        ctx.strokeStyle = explosion.color.replace(')', `, ${alpha * 0.8})`).replace('hsl', 'hsla');
        ctx.lineWidth = 3 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize, 0, Math.PI * 2);
        ctx.stroke();
        
        const innerGradient = ctx.createRadialGradient(
          explosion.x, explosion.y, 0,
          explosion.x, explosion.y, currentSize * 0.6
        );
        innerGradient.addColorStop(0, `hsla(45, 100%, 80%, ${alpha * 0.8})`);
        innerGradient.addColorStop(0.5, explosion.color.replace(')', `, ${alpha * 0.5})`).replace('hsl', 'hsla'));
        innerGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        const particleCount = 6;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const particleDist = currentSize * (0.8 + progress * 0.5);
          const px = explosion.x + Math.cos(angle) * particleDist;
          const py = explosion.y + Math.sin(angle) * particleDist;
          const particleSize = 4 * (1 - progress);
          
          ctx.fillStyle = `hsla(${explosionHue + 45}, 100%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    });

    // Draw orbitals
    gameState.orbitals.forEach((orbital) => {
      const orbX = gameState.player.x + Math.cos(orbital.angle) * orbital.orbitRadius;
      const orbY = gameState.player.y + Math.sin(orbital.angle) * orbital.orbitRadius;
      
      ctx.save();
      
      if (theme === 'cat') {
        // Yarn ball orbital
        ctx.shadowColor = 'hsl(300, 70%, 60%)';
        ctx.shadowBlur = 15;
        
        const gradient = ctx.createRadialGradient(
          orbX, orbY, 0,
          orbX, orbY, orbital.size
        );
        gradient.addColorStop(0, 'hsl(300, 70%, 80%)');
        gradient.addColorStop(0.4, 'hsl(320, 60%, 60%)');
        gradient.addColorStop(1, 'hsl(340, 50%, 45%)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbital.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Yarn lines
        ctx.strokeStyle = 'hsla(300, 60%, 85%, 0.6)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          const lineAngle = (i / 4) * Math.PI + orbital.angle;
          ctx.beginPath();
          ctx.arc(orbX, orbY, orbital.size * 0.7, lineAngle, lineAngle + Math.PI * 0.3);
          ctx.stroke();
        }
      } else {
        // Energy orb orbital
        ctx.shadowColor = 'hsl(50, 100%, 60%)';
        ctx.shadowBlur = 20;
        
        const gradient = ctx.createRadialGradient(
          orbX, orbY, 0,
          orbX, orbY, orbital.size
        );
        gradient.addColorStop(0, 'hsl(50, 100%, 90%)');
        gradient.addColorStop(0.4, 'hsl(40, 100%, 60%)');
        gradient.addColorStop(0.8, 'hsl(30, 100%, 50%)');
        gradient.addColorStop(1, 'hsla(20, 100%, 40%, 0.5)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbital.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'hsl(50, 100%, 95%)';
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbital.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Trail effect
      const trailLength = 5;
      for (let i = 1; i <= trailLength; i++) {
        const trailAngle = orbital.angle - (i * 0.15);
        const trailX = gameState.player.x + Math.cos(trailAngle) * orbital.orbitRadius;
        const trailY = gameState.player.y + Math.sin(trailAngle) * orbital.orbitRadius;
        const alpha = 0.3 - (i * 0.05);
        const trailSize = orbital.size * (1 - i * 0.1);
        
        const trailHue = theme === 'cat' ? 300 : 40;
        ctx.fillStyle = `hsla(${trailHue}, 100%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });

    // Draw player with theme
    if (theme === 'cat') {
      drawCatPlayer(ctx, gameState.player);
    } else {
      drawSpaceshipPlayer(ctx, gameState.player);
    }

    // Draw active power-up effects
    const hasShield = gameState.activePowerUps.some(ap => ap.type === 'shield');
    const hasMagnet = gameState.activePowerUps.some(ap => ap.type === 'magnet');
    
    if (hasShield) {
      // Shield bubble around player
      ctx.save();
      const shieldPulse = 1 + Math.sin(gameState.gameTime * 8) * 0.1;
      const shieldRadius = 40 * shieldPulse;
      
      ctx.strokeStyle = 'hsla(180, 100%, 60%, 0.6)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'hsl(180, 100%, 50%)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, shieldRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner glow
      const innerGradient = ctx.createRadialGradient(
        gameState.player.x, gameState.player.y, 0,
        gameState.player.x, gameState.player.y, shieldRadius
      );
      innerGradient.addColorStop(0, 'hsla(180, 100%, 70%, 0)');
      innerGradient.addColorStop(0.7, 'hsla(180, 100%, 60%, 0.1)');
      innerGradient.addColorStop(1, 'hsla(180, 100%, 50%, 0.3)');
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, shieldRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    if (hasMagnet) {
      // Magnet field effect
      ctx.save();
      const magnetPulse = 1 + Math.sin(gameState.gameTime * 4) * 0.2;
      const magnetRadius = 300 * magnetPulse;
      
      ctx.strokeStyle = 'hsla(280, 80%, 60%, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.arc(gameState.player.x, gameState.player.y, magnetRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

  }, [gameState, canvasWidth, canvasHeight, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="game-canvas"
    />
  );
};
