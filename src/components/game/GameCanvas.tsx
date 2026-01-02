import React, { useEffect, useRef } from 'react';
import { GameState } from '@/types/game';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = 'hsl(240, 10%, 4%)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = 'hsl(240, 10%, 10%)';
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

    // Draw XP gems
    gameState.xpGems.forEach((gem) => {
      ctx.save();
      ctx.shadowColor = 'hsl(45, 100%, 51%)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'hsl(45, 100%, 51%)';
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

    // Draw projectiles
    gameState.projectiles.forEach((proj) => {
      ctx.save();
      ctx.shadowColor = 'hsl(265, 89%, 66%)';
      ctx.shadowBlur = 15;
      
      const gradient = ctx.createRadialGradient(
        proj.x, proj.y, 0,
        proj.x, proj.y, proj.size
      );
      gradient.addColorStop(0, 'hsl(265, 89%, 80%)');
      gradient.addColorStop(0.5, 'hsl(265, 89%, 66%)');
      gradient.addColorStop(1, 'hsl(265, 89%, 40%)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw enemies
    gameState.enemies.forEach((enemy) => {
      ctx.save();
      
      let color: string;
      switch (enemy.type) {
        case 'fast':
          color = 'hsl(30, 100%, 50%)';
          break;
        case 'tank':
          color = 'hsl(0, 60%, 35%)';
          break;
        default:
          color = 'hsl(0, 72%, 51%)';
      }
      
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Health bar
      const healthPercent = enemy.health / enemy.maxHealth;
      const barWidth = enemy.size * 2;
      const barHeight = 4;
      
      ctx.fillStyle = 'hsl(0, 72%, 30%)';
      ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.size - 10, barWidth, barHeight);
      
      ctx.fillStyle = 'hsl(120, 70%, 45%)';
      ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.size - 10, barWidth * healthPercent, barHeight);
      
      ctx.restore();
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
        const rotationOffset = progress * Math.PI * 4; // Spiral rotation
        
        // Outer expanding ring
        ctx.strokeStyle = `hsla(280, 100%, 60%, ${alpha * 0.8})`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring
        ctx.strokeStyle = `hsla(200, 100%, 60%, ${alpha * 0.6})`;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Central flash gradient
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
        
        // Spiral particles
        const particleCount = 10;
        for (let i = 0; i < particleCount; i++) {
          const baseAngle = (i / particleCount) * Math.PI * 2;
          const spiralAngle = baseAngle + rotationOffset;
          const particleDist = currentSize * (0.3 + progress * 0.8);
          const px = explosion.x + Math.cos(spiralAngle) * particleDist;
          const py = explosion.y + Math.sin(spiralAngle) * particleDist;
          const particleSize = 5 * (1 - progress);
          
          // Alternating purple and cyan particles
          const hue = i % 2 === 0 ? 280 : 200;
          ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Additional outer spiral particles
        for (let i = 0; i < 6; i++) {
          const baseAngle = (i / 6) * Math.PI * 2;
          const spiralAngle = baseAngle - rotationOffset * 0.5; // Counter-rotate
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
        // Normal explosion
        // Outer ring
        ctx.strokeStyle = explosion.color.replace(')', `, ${alpha * 0.8})`).replace('hsl', 'hsla');
        ctx.lineWidth = 3 * (1 - progress);
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, currentSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner flash
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
        
        // Particles
        const particleCount = 6;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const particleDist = currentSize * (0.8 + progress * 0.5);
          const px = explosion.x + Math.cos(angle) * particleDist;
          const py = explosion.y + Math.sin(angle) * particleDist;
          const particleSize = 4 * (1 - progress);
          
          ctx.fillStyle = `hsla(45, 100%, 70%, ${alpha})`;
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
      
      // Glow effect
      ctx.shadowColor = 'hsl(50, 100%, 60%)';
      ctx.shadowBlur = 20;
      
      // Outer glow ring
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
      
      // Inner bright core
      ctx.fillStyle = 'hsl(50, 100%, 95%)';
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbital.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Trail effect
      const trailLength = 5;
      for (let i = 1; i <= trailLength; i++) {
        const trailAngle = orbital.angle - (i * 0.15);
        const trailX = gameState.player.x + Math.cos(trailAngle) * orbital.orbitRadius;
        const trailY = gameState.player.y + Math.sin(trailAngle) * orbital.orbitRadius;
        const alpha = 0.3 - (i * 0.05);
        const trailSize = orbital.size * (1 - i * 0.1);
        
        ctx.fillStyle = `hsla(40, 100%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });

    // Draw player
    const { player } = gameState;
    ctx.save();
    ctx.shadowColor = 'hsl(180, 100%, 50%)';
    ctx.shadowBlur = 20;
    
    const playerGradient = ctx.createRadialGradient(
      player.x, player.y, 0,
      player.x, player.y, 20
    );
    playerGradient.addColorStop(0, 'hsl(180, 100%, 70%)');
    playerGradient.addColorStop(0.5, 'hsl(180, 100%, 50%)');
    playerGradient.addColorStop(1, 'hsl(180, 100%, 30%)');
    
    ctx.fillStyle = playerGradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner glow
    ctx.fillStyle = 'hsl(180, 100%, 80%)';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();

  }, [gameState, canvasWidth, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="game-canvas"
    />
  );
};
