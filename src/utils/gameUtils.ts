import { Enemy, Player, Projectile, XpGem, Upgrade, Weapon } from '@/types/game';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const normalize = (x: number, y: number) => {
  const mag = Math.sqrt(x * x + y * y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: x / mag, y: y / mag };
};

export const createEnemy = (
  playerX: number,
  playerY: number,
  gameTime: number,
  canvasWidth: number,
  canvasHeight: number
): Enemy => {
  const side = Math.floor(Math.random() * 4);
  let x: number, y: number;
  const margin = 50;

  switch (side) {
    case 0: // top
      x = Math.random() * canvasWidth;
      y = -margin;
      break;
    case 1: // right
      x = canvasWidth + margin;
      y = Math.random() * canvasHeight;
      break;
    case 2: // bottom
      x = Math.random() * canvasWidth;
      y = canvasHeight + margin;
      break;
    default: // left
      x = -margin;
      y = Math.random() * canvasHeight;
  }

  const difficulty = 1 + gameTime / 60;
  const rand = Math.random();
  
  let type: Enemy['type'];
  let health: number;
  let speed: number;
  let damage: number;
  let size: number;

  if (rand < 0.6) {
    type = 'basic';
    health = 20 * difficulty;
    speed = 60 + Math.random() * 20;
    damage = 10;
    size = 20;
  } else if (rand < 0.85) {
    type = 'fast';
    health = 10 * difficulty;
    speed = 100 + Math.random() * 30;
    damage = 5;
    size = 15;
  } else {
    type = 'tank';
    health = 50 * difficulty;
    speed = 30 + Math.random() * 10;
    damage = 20;
    size = 30;
  }

  return {
    id: generateId(),
    x,
    y,
    health,
    maxHealth: health,
    speed,
    damage,
    size,
    type,
  };
};

export const createProjectile = (
  playerX: number,
  playerY: number,
  targetX: number,
  targetY: number,
  weapon: Weapon
): Projectile => {
  const dir = normalize(targetX - playerX, targetY - playerY);
  
  return {
    id: generateId(),
    x: playerX,
    y: playerY,
    vx: dir.x * weapon.projectileSpeed,
    vy: dir.y * weapon.projectileSpeed,
    damage: weapon.damage,
    size: 8 * weapon.area,
    piercing: weapon.piercing,
    hitEnemies: new Set(),
  };
};

export const createXpGem = (x: number, y: number, value: number): XpGem => ({
  id: generateId(),
  x,
  y,
  value,
});

export const getUpgrades = (): Upgrade[] => [
  {
    id: 'damage',
    name: '공격력 증가',
    description: '공격력 +20%',
    icon: '⚔️',
    apply: (player, weapon) => ({
      player,
      weapon: { ...weapon, damage: weapon.damage * 1.2 },
    }),
  },
  {
    id: 'speed',
    name: '이동속도 증가',
    description: '이동속도 +15%',
    icon: '👟',
    apply: (player, weapon) => ({
      player: { ...player, speed: player.speed * 1.15 },
      weapon,
    }),
  },
  {
    id: 'firerate',
    name: '공격속도 증가',
    description: '공격속도 +20%',
    icon: '⚡',
    apply: (player, weapon) => ({
      player,
      weapon: { ...weapon, fireRate: weapon.fireRate * 0.8 },
    }),
  },
  {
    id: 'projectiles',
    name: '투사체 추가',
    description: '투사체 +1',
    icon: '🔮',
    apply: (player, weapon) => ({
      player,
      weapon: { ...weapon, projectileCount: weapon.projectileCount + 1 },
    }),
  },
  {
    id: 'maxhealth',
    name: '최대 체력 증가',
    description: '최대 체력 +25',
    icon: '❤️',
    apply: (player, weapon) => ({
      player: { 
        ...player, 
        maxHealth: player.maxHealth + 25,
        health: player.health + 25,
      },
      weapon,
    }),
  },
  {
    id: 'heal',
    name: '체력 회복',
    description: '체력 30% 회복',
    icon: '💚',
    apply: (player, weapon) => ({
      player: { 
        ...player, 
        health: Math.min(player.maxHealth, player.health + player.maxHealth * 0.3),
      },
      weapon,
    }),
  },
  {
    id: 'area',
    name: '공격 범위 증가',
    description: '투사체 크기 +25%',
    icon: '💥',
    apply: (player, weapon) => ({
      player,
      weapon: { ...weapon, area: weapon.area * 1.25 },
    }),
  },
  {
    id: 'piercing',
    name: '관통력 증가',
    description: '관통 +1',
    icon: '🎯',
    apply: (player, weapon) => ({
      player,
      weapon: { ...weapon, piercing: weapon.piercing + 1 },
    }),
  },
];

export const getRandomUpgrades = (count: number = 3): Upgrade[] => {
  const allUpgrades = getUpgrades();
  const shuffled = [...allUpgrades].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
