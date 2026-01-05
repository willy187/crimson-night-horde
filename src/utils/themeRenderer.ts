import { Player, Enemy, GameTheme } from '@/types/game';

// ========== CAT THEME ==========

export const drawCatPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  const { x, y, rotation } = player;
  const size = 20;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Body (oval)
  ctx.fillStyle = 'hsl(35, 70%, 60%)';
  ctx.shadowColor = 'hsl(35, 70%, 60%)';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.9, size * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'hsl(35, 70%, 65%)';
  ctx.beginPath();
  ctx.arc(size * 0.6, 0, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
  
  // Ears
  ctx.fillStyle = 'hsl(35, 70%, 55%)';
  // Left ear
  ctx.beginPath();
  ctx.moveTo(size * 0.7, -size * 0.3);
  ctx.lineTo(size * 0.9, -size * 0.8);
  ctx.lineTo(size * 1.1, -size * 0.25);
  ctx.closePath();
  ctx.fill();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(size * 0.7, size * 0.3);
  ctx.lineTo(size * 0.9, size * 0.8);
  ctx.lineTo(size * 1.1, size * 0.25);
  ctx.closePath();
  ctx.fill();
  
  // Inner ears (pink)
  ctx.fillStyle = 'hsl(350, 70%, 75%)';
  ctx.beginPath();
  ctx.moveTo(size * 0.75, -size * 0.35);
  ctx.lineTo(size * 0.85, -size * 0.6);
  ctx.lineTo(size * 0.95, -size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(size * 0.75, size * 0.35);
  ctx.lineTo(size * 0.85, size * 0.6);
  ctx.lineTo(size * 0.95, size * 0.3);
  ctx.closePath();
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = 'hsl(0, 0%, 100%)';
  ctx.beginPath();
  ctx.ellipse(size * 0.6, -size * 0.15, size * 0.18, size * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.6, size * 0.15, size * 0.18, size * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Pupils
  ctx.fillStyle = 'hsl(120, 60%, 35%)';
  ctx.beginPath();
  ctx.ellipse(size * 0.65, -size * 0.15, size * 0.08, size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.65, size * 0.15, size * 0.08, size * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = 'hsl(350, 60%, 65%)';
  ctx.beginPath();
  ctx.moveTo(size * 0.95, 0);
  ctx.lineTo(size * 0.85, -size * 0.08);
  ctx.lineTo(size * 0.85, size * 0.08);
  ctx.closePath();
  ctx.fill();
  
  // Whiskers
  ctx.strokeStyle = 'hsl(0, 0%, 30%)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(size * 0.8, i * size * 0.1);
    ctx.lineTo(size * 1.3, i * size * 0.2 - size * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.8, i * size * 0.1);
    ctx.lineTo(size * 1.3, i * size * 0.2 + size * 0.15);
    ctx.stroke();
  }
  
  // Tail (behind body)
  ctx.strokeStyle = 'hsl(35, 70%, 55%)';
  ctx.lineWidth = size * 0.25;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.8, 0);
  ctx.quadraticCurveTo(-size * 1.2, -size * 0.5, -size * 1.4, -size * 0.3);
  ctx.stroke();
  
  ctx.restore();
};

export const drawMouseEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
  const { x, y, rotation, size, type } = enemy;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Color based on type
  let bodyColor: string;
  let darkColor: string;
  switch (type) {
    case 'fast':
      bodyColor = 'hsl(30, 40%, 55%)';
      darkColor = 'hsl(30, 40%, 40%)';
      break;
    case 'tank':
      bodyColor = 'hsl(0, 15%, 35%)';
      darkColor = 'hsl(0, 15%, 25%)';
      break;
    default:
      bodyColor = 'hsl(0, 0%, 55%)';
      darkColor = 'hsl(0, 0%, 40%)';
  }
  
  // Body (oval)
  ctx.fillStyle = bodyColor;
  ctx.shadowColor = bodyColor;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.9, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.shadowBlur = 0;
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(size * 0.6, 0, size * 0.45, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Ears (big round)
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.arc(size * 0.4, -size * 0.5, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.5, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner ears
  ctx.fillStyle = 'hsl(350, 50%, 70%)';
  ctx.beginPath();
  ctx.arc(size * 0.4, -size * 0.5, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.5, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes (red/evil looking)
  ctx.fillStyle = 'hsl(0, 80%, 50%)';
  ctx.beginPath();
  ctx.arc(size * 0.7, -size * 0.12, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.12, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = 'hsl(350, 50%, 60%)';
  ctx.beginPath();
  ctx.arc(size * 0.95, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  
  // Tail
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size * 0.8, 0);
  ctx.quadraticCurveTo(-size * 1.4, size * 0.4, -size * 1.6, -size * 0.2);
  ctx.stroke();
  
  ctx.restore();
  
  // Health bar (outside rotation)
  const healthPercent = enemy.health / enemy.maxHealth;
  const barWidth = size * 2;
  const barHeight = 4;
  
  ctx.fillStyle = 'hsl(0, 72%, 30%)';
  ctx.fillRect(x - barWidth / 2, y - size - 10, barWidth, barHeight);
  
  ctx.fillStyle = 'hsl(120, 70%, 45%)';
  ctx.fillRect(x - barWidth / 2, y - size - 10, barWidth * healthPercent, barHeight);
};

// ========== SPACE THEME ==========

export const drawSpaceshipPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  const { x, y, rotation } = player;
  const size = 20;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Engine glow
  ctx.shadowColor = 'hsl(200, 100%, 60%)';
  ctx.shadowBlur = 20;
  
  // Main body (triangle)
  ctx.fillStyle = 'hsl(210, 30%, 50%)';
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.7, -size * 0.6);
  ctx.lineTo(-size * 0.5, 0);
  ctx.lineTo(-size * 0.7, size * 0.6);
  ctx.closePath();
  ctx.fill();
  
  // Cockpit
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'hsl(180, 80%, 60%)';
  ctx.beginPath();
  ctx.ellipse(size * 0.2, 0, size * 0.35, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Wing details
  ctx.fillStyle = 'hsl(210, 40%, 40%)';
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, -size * 0.3);
  ctx.lineTo(-size * 0.7, -size * 0.6);
  ctx.lineTo(-size * 0.5, -size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.3, size * 0.3);
  ctx.lineTo(-size * 0.7, size * 0.6);
  ctx.lineTo(-size * 0.5, size * 0.2);
  ctx.closePath();
  ctx.fill();
  
  // Engine flames
  ctx.fillStyle = 'hsl(30, 100%, 60%)';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.15);
  ctx.lineTo(-size * 1.1, 0);
  ctx.lineTo(-size * 0.5, size * 0.15);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = 'hsl(45, 100%, 70%)';
  ctx.beginPath();
  ctx.moveTo(-size * 0.5, -size * 0.08);
  ctx.lineTo(-size * 0.85, 0);
  ctx.lineTo(-size * 0.5, size * 0.08);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
};

export const drawAlienShip = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
  const { x, y, rotation, size, type } = enemy;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Color based on type
  let mainColor: string;
  let glowColor: string;
  switch (type) {
    case 'fast':
      mainColor = 'hsl(60, 80%, 50%)';
      glowColor = 'hsl(60, 100%, 60%)';
      break;
    case 'tank':
      mainColor = 'hsl(280, 60%, 45%)';
      glowColor = 'hsl(280, 80%, 60%)';
      break;
    default:
      mainColor = 'hsl(120, 60%, 45%)';
      glowColor = 'hsl(120, 80%, 55%)';
  }
  
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12;
  
  // UFO dome
  ctx.fillStyle = 'hsla(180, 60%, 70%, 0.8)';
  ctx.beginPath();
  ctx.ellipse(size * 0.1, 0, size * 0.35, size * 0.3, 0, -Math.PI, 0);
  ctx.fill();
  
  // Main saucer body
  ctx.shadowBlur = 8;
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.9, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Bottom ring
  ctx.shadowBlur = 0;
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.ellipse(0, size * 0.1, size * 0.5, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Lights
  ctx.fillStyle = 'hsl(0, 80%, 55%)';
  const lightCount = 4;
  for (let i = 0; i < lightCount; i++) {
    const angle = (i / lightCount) * Math.PI * 2;
    const lx = Math.cos(angle) * size * 0.6;
    const ly = Math.sin(angle) * size * 0.2;
    ctx.beginPath();
    ctx.arc(lx, ly, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
  
  // Health bar
  const healthPercent = enemy.health / enemy.maxHealth;
  const barWidth = size * 2;
  const barHeight = 4;
  
  ctx.fillStyle = 'hsl(0, 72%, 30%)';
  ctx.fillRect(x - barWidth / 2, y - size - 10, barWidth, barHeight);
  
  ctx.fillStyle = 'hsl(120, 70%, 45%)';
  ctx.fillRect(x - barWidth / 2, y - size - 10, barWidth * healthPercent, barHeight);
};

// Projectile drawer - changes based on theme
export const drawThemedProjectile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  theme: GameTheme,
  angle: number = 0
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  if (theme === 'cat') {
    // Cat paw print projectile
    ctx.shadowColor = 'hsl(35, 80%, 60%)';
    ctx.shadowBlur = 12;
    
    // Main pad
    ctx.fillStyle = 'hsl(350, 60%, 70%)';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.2, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Toe beans
    ctx.fillStyle = 'hsl(350, 50%, 80%)';
    const toePositions = [
      { x: -size * 0.5, y: -size * 0.4 },
      { x: 0, y: -size * 0.6 },
      { x: size * 0.5, y: -size * 0.4 },
    ];
    toePositions.forEach(pos => {
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y, size * 0.35, size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Glow effect
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'hsla(350, 80%, 90%, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Space laser beam projectile
    ctx.shadowColor = 'hsl(180, 100%, 60%)';
    ctx.shadowBlur = 15;
    
    // Elongated laser shape
    const gradient = ctx.createLinearGradient(-size * 1.5, 0, size * 1.5, 0);
    gradient.addColorStop(0, 'hsla(200, 100%, 70%, 0.3)');
    gradient.addColorStop(0.3, 'hsl(180, 100%, 80%)');
    gradient.addColorStop(0.5, 'hsl(180, 100%, 95%)');
    gradient.addColorStop(0.7, 'hsl(180, 100%, 80%)');
    gradient.addColorStop(1, 'hsla(200, 100%, 70%, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.5, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    ctx.fillStyle = 'hsl(180, 100%, 95%)';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.8, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Trailing particles
    ctx.fillStyle = 'hsla(200, 100%, 80%, 0.6)';
    ctx.beginPath();
    ctx.arc(-size * 1.2, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-size * 1.6, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};
