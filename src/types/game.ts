export interface Position {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  size: number;
  type: 'basic' | 'fast' | 'tank';
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  size: number;
  piercing: number;
  hitEnemies: Set<string>;
}

export interface XpGem {
  id: string;
  x: number;
  y: number;
  value: number;
}

export interface Weapon {
  name: string;
  damage: number;
  fireRate: number;
  projectileCount: number;
  projectileSpeed: number;
  piercing: number;
  area: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  apply: (player: Player, weapon: Weapon) => { player: Player; weapon: Weapon };
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  size: number;
  color: string;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  xpGems: XpGem[];
  explosions: Explosion[];
  weapon: Weapon;
  gameTime: number;
  kills: number;
  isGameOver: boolean;
  isPaused: boolean;
  isLevelingUp: boolean;
  availableUpgrades: Upgrade[];
}
