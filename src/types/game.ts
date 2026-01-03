export type GameTheme = 'cat' | 'space';

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
  rotation: number;
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
  rotation: number;
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

export interface Orbital {
  id: string;
  angle: number;
  damage: number;
  size: number;
  orbitRadius: number;
  rotationSpeed: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  apply: (player: Player, weapon: Weapon, orbitals: Orbital[]) => { player: Player; weapon: Weapon; orbitals: Orbital[] };
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  startTime: number;
  duration: number;
  size: number;
  color: string;
  isOrbital?: boolean;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  xpGems: XpGem[];
  explosions: Explosion[];
  orbitals: Orbital[];
  weapon: Weapon;
  gameTime: number;
  kills: number;
  isGameOver: boolean;
  isPaused: boolean;
  isLevelingUp: boolean;
  availableUpgrades: Upgrade[];
  theme: GameTheme;
}
