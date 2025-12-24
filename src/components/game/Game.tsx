import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, Weapon, Enemy, Projectile, XpGem, Upgrade } from '@/types/game';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTouchJoystick } from '@/hooks/useTouchJoystick';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  createEnemy, 
  createProjectile, 
  createXpGem, 
  distance, 
  normalize,
  getRandomUpgrades,
} from '@/utils/gameUtils';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { LevelUpScreen } from './LevelUpScreen';
import { GameOverScreen } from './GameOverScreen';
import { StartScreen } from './StartScreen';
import { VirtualJoystick } from './VirtualJoystick';

const CANVAS_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1920;
const CANVAS_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 1080;

const initialPlayer: Player = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
  health: 100,
  maxHealth: 100,
  speed: 200,
  level: 1,
  xp: 0,
  xpToNextLevel: 10,
};

const initialWeapon: Weapon = {
  name: 'Magic Orb',
  damage: 10,
  fireRate: 0.8,
  projectileCount: 1,
  projectileSpeed: 400,
  piercing: 1,
  area: 1,
};

export const Game: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    player: { ...initialPlayer },
    enemies: [],
    projectiles: [],
    xpGems: [],
    weapon: { ...initialWeapon },
    gameTime: 0,
    kills: 0,
    isGameOver: false,
    isPaused: false,
    isLevelingUp: false,
    availableUpgrades: [],
  });

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.isGameOver || prev.isLevelingUp) return prev;
      return { ...prev, isPaused: !prev.isPaused };
    });
  }, []);

  const keys = useKeyboard(togglePause);
  const { touch, joystickPosition, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchJoystick();
  const isMobile = useIsMobile();
  const lastFireTime = useRef(0);
  const lastSpawnTime = useRef(0);

  const resetGame = useCallback(() => {
    setGameState({
      player: { ...initialPlayer, x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      enemies: [],
      projectiles: [],
      xpGems: [],
      weapon: { ...initialWeapon },
      gameTime: 0,
      kills: 0,
      isGameOver: false,
      isPaused: false,
      isLevelingUp: false,
      availableUpgrades: [],
    });
    lastFireTime.current = 0;
    lastSpawnTime.current = 0;
  }, []);

  const handleStart = useCallback(() => {
    resetGame();
    setGameStarted(true);
  }, [resetGame]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleSelectUpgrade = useCallback((upgrade: Upgrade) => {
    setGameState((prev) => {
      const { player, weapon } = upgrade.apply(prev.player, prev.weapon);
      return {
        ...prev,
        player,
        weapon,
        isLevelingUp: false,
        isPaused: false,
        availableUpgrades: [],
      };
    });
  }, []);

  const gameLoop = useCallback(
    (deltaTime: number) => {
      setGameState((prev) => {
        if (prev.isGameOver || prev.isPaused || prev.isLevelingUp) return prev;

        let { player, enemies, projectiles, xpGems, weapon, gameTime, kills } = prev;

        // Update game time
        gameTime += deltaTime;

        // Move player (keyboard OR touch)
        let dx = 0;
        let dy = 0;
        if (keys.current.up || touch.current.up) dy -= 1;
        if (keys.current.down || touch.current.down) dy += 1;
        if (keys.current.left || touch.current.left) dx -= 1;
        if (keys.current.right || touch.current.right) dx += 1;

        if (dx !== 0 || dy !== 0) {
          const normalized = normalize(dx, dy);
          player = {
            ...player,
            x: Math.max(20, Math.min(CANVAS_WIDTH - 20, player.x + normalized.x * player.speed * deltaTime)),
            y: Math.max(20, Math.min(CANVAS_HEIGHT - 20, player.y + normalized.y * player.speed * deltaTime)),
          };
        }

        // Spawn enemies
        const spawnInterval = Math.max(0.3, 2 - gameTime / 60);
        if (gameTime - lastSpawnTime.current > spawnInterval) {
          const newEnemy = createEnemy(player.x, player.y, gameTime, CANVAS_WIDTH, CANVAS_HEIGHT);
          enemies = [...enemies, newEnemy];
          lastSpawnTime.current = gameTime;
        }

        // Auto-fire at nearest enemy
        if (enemies.length > 0 && gameTime - lastFireTime.current > weapon.fireRate) {
          let nearestEnemy: Enemy | null = null;
          let nearestDist = Infinity;

          enemies.forEach((enemy) => {
            const dist = distance(player.x, player.y, enemy.x, enemy.y);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestEnemy = enemy;
            }
          });

          if (nearestEnemy) {
            const newProjectiles: Projectile[] = [];
            const angleSpread = Math.PI / 8;
            const baseAngle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);

            for (let i = 0; i < weapon.projectileCount; i++) {
              const angleOffset = weapon.projectileCount > 1
                ? (i - (weapon.projectileCount - 1) / 2) * angleSpread
                : 0;
              const angle = baseAngle + angleOffset;
              const targetX = player.x + Math.cos(angle) * 100;
              const targetY = player.y + Math.sin(angle) * 100;
              newProjectiles.push(createProjectile(player.x, player.y, targetX, targetY, weapon));
            }

            projectiles = [...projectiles, ...newProjectiles];
            lastFireTime.current = gameTime;
          }
        }

        // Move projectiles
        projectiles = projectiles
          .map((proj) => ({
            ...proj,
            x: proj.x + proj.vx * deltaTime,
            y: proj.y + proj.vy * deltaTime,
          }))
          .filter(
            (proj) =>
              proj.x > -50 &&
              proj.x < CANVAS_WIDTH + 50 &&
              proj.y > -50 &&
              proj.y < CANVAS_HEIGHT + 50
          );

        // Move enemies toward player
        enemies = enemies.map((enemy) => {
          const dir = normalize(player.x - enemy.x, player.y - enemy.y);
          return {
            ...enemy,
            x: enemy.x + dir.x * enemy.speed * deltaTime,
            y: enemy.y + dir.y * enemy.speed * deltaTime,
          };
        });

        // Projectile-enemy collision
        const newXpGems: XpGem[] = [];
        let projectilesToRemove: Set<string> = new Set();
        
        enemies = enemies.filter((enemy) => {
          for (const proj of projectiles) {
            if (proj.hitEnemies.has(enemy.id)) continue;
            
            const dist = distance(proj.x, proj.y, enemy.x, enemy.y);
            if (dist < proj.size + enemy.size) {
              enemy.health -= proj.damage;
              proj.hitEnemies.add(enemy.id);
              
              if (proj.hitEnemies.size >= proj.piercing) {
                projectilesToRemove.add(proj.id);
              }

              if (enemy.health <= 0) {
                kills++;
                newXpGems.push(createXpGem(enemy.x, enemy.y, enemy.type === 'tank' ? 5 : enemy.type === 'fast' ? 2 : 3));
                return false;
              }
            }
          }
          return true;
        });

        projectiles = projectiles.filter((p) => !projectilesToRemove.has(p.id));
        xpGems = [...xpGems, ...newXpGems];

        // Player collects XP gems
        const XP_COLLECT_RANGE = 50;
        let xpGained = 0;
        xpGems = xpGems.filter((gem) => {
          const dist = distance(player.x, player.y, gem.x, gem.y);
          if (dist < XP_COLLECT_RANGE) {
            xpGained += gem.value;
            return false;
          }
          return true;
        });

        if (xpGained > 0) {
          player = { ...player, xp: player.xp + xpGained };
        }

        // Level up check
        let isLevelingUp = false;
        let availableUpgrades: Upgrade[] = [];
        
        if (player.xp >= player.xpToNextLevel) {
          player = {
            ...player,
            level: player.level + 1,
            xp: player.xp - player.xpToNextLevel,
            xpToNextLevel: Math.floor(player.xpToNextLevel * 1.5),
          };
          isLevelingUp = true;
          availableUpgrades = getRandomUpgrades(3);
        }

        // Enemy-player collision (damage)
        enemies.forEach((enemy) => {
          const dist = distance(player.x, player.y, enemy.x, enemy.y);
          if (dist < 20 + enemy.size) {
            player = { ...player, health: player.health - enemy.damage * deltaTime };
          }
        });

        // Check game over
        const isGameOver = player.health <= 0;

        return {
          ...prev,
          player,
          enemies,
          projectiles,
          xpGems,
          gameTime,
          kills,
          isGameOver,
          isLevelingUp,
          isPaused: isLevelingUp,
          availableUpgrades,
        };
      });
    },
    [keys, touch]
  );

  useGameLoop(gameLoop, gameStarted && !gameState.isGameOver && !gameState.isLevelingUp);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Game will use new dimensions on reset
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!gameStarted) {
    return (
      <div className="game-container">
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  return (
    <div 
      className="game-container"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <GameCanvas
        gameState={gameState}
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
      />

      {gameState.isPaused && !gameState.isLevelingUp && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">일시정지</h2>
            <p className="text-lg text-gray-300">스페이스바를 눌러 계속하기</p>
          </div>
        </div>
      )}

      <GameHUD
        player={gameState.player}
        weapon={gameState.weapon}
        gameTime={gameState.gameTime}
        kills={gameState.kills}
      />

      {isMobile && <VirtualJoystick joystickPosition={joystickPosition} />}

      {gameState.isLevelingUp && (
        <LevelUpScreen
          upgrades={gameState.availableUpgrades}
          onSelectUpgrade={handleSelectUpgrade}
          level={gameState.player.level}
        />
      )}

      {gameState.isGameOver && (
        <GameOverScreen
          gameTime={gameState.gameTime}
          kills={gameState.kills}
          level={gameState.player.level}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};
