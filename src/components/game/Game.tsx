import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, Weapon, Enemy, Projectile, XpGem, Upgrade, Explosion, Orbital } from '@/types/game';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTouchJoystick } from '@/hooks/useTouchJoystick';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOrientation } from '@/hooks/useMobileOrientation';
import { useSoundManager } from '@/hooks/useSoundManager';
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
import { InitialInputScreen } from './InitialInputScreen';
import { Leaderboard, checkTopTen, submitHighScore } from './Leaderboard';
import { RotateDeviceOverlay } from './RotateDeviceOverlay';
import { PauseScreen } from './PauseScreen';

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
  damage: 11,
  fireRate: 0.8,
  projectileCount: 1,
  projectileSpeed: 400,
  piercing: 1,
  area: 1,
};

export const Game: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInitialInput, setShowInitialInput] = useState(false);
  const [hasCheckedTopTen, setHasCheckedTopTen] = useState(false);
  const [topTenRank, setTopTenRank] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    player: { ...initialPlayer },
    enemies: [],
    projectiles: [],
    xpGems: [],
    explosions: [],
    orbitals: [],
    weapon: { ...initialWeapon },
    gameTime: 0,
    kills: 0,
    isGameOver: false,
    isPaused: false,
    isLevelingUp: false,
    availableUpgrades: [],
  });

  const { isMuted, playShoot, playExplosion, playLevelUp, playGameOver, startBgm, stopBgm, toggleMute } = useSoundManager();
  const gameOverSoundPlayed = useRef(false);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.isGameOver || prev.isLevelingUp) return prev;
      return { ...prev, isPaused: !prev.isPaused };
    });
  }, []);

  const keys = useKeyboard(togglePause, toggleMute);
  const { touch, joystickPosition, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchJoystick();
  const isMobile = useIsMobile();
  const { isMobile: isMobileDevice, needsRotation, requestFullscreen } = useMobileOrientation();
  const lastFireTime = useRef(0);
  const lastSpawnTime = useRef(0);
  const pendingSoundsRef = useRef<{ shoots: number; explosions: number; levelUp: boolean }>({ shoots: 0, explosions: 0, levelUp: false });

  const resetGame = useCallback(() => {
    setGameState({
      player: { ...initialPlayer, x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      enemies: [],
      projectiles: [],
      xpGems: [],
      explosions: [],
      orbitals: [],
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
    gameOverSoundPlayed.current = false;
  }, []);

  const handleStart = useCallback(() => {
    resetGame();
    setGameStarted(true);
    startBgm();
  }, [resetGame, startBgm]);

  const handleRestart = useCallback(() => {
    setShowInitialInput(false);
    setHasCheckedTopTen(false);
    setTopTenRank(0);
    setFinalScore(0);
    resetGame();
  }, [resetGame]);

  // Calculate score
  const calculateScore = useCallback((kills: number, gameTime: number, level: number) => {
    return kills * 100 + Math.floor(gameTime) * 10 + level * 500;
  }, []);

  // Check for top 10 when game ends
  useEffect(() => {
    if (gameState.isGameOver && !hasCheckedTopTen) {
      setHasCheckedTopTen(true);
      const score = calculateScore(gameState.kills, gameState.gameTime, gameState.player.level);
      setFinalScore(score);
      
      checkTopTen(score).then(({ qualifies, rank }) => {
        if (qualifies) {
          setTopTenRank(rank);
          setShowInitialInput(true);
        }
      });
    }
  }, [gameState.isGameOver, gameState.kills, gameState.gameTime, gameState.player.level, hasCheckedTopTen, calculateScore]);

  const handleSubmitInitials = useCallback(async (initials: string) => {
    await submitHighScore(
      initials,
      finalScore,
      gameState.gameTime,
      gameState.kills,
      gameState.player.level
    );
    setShowInitialInput(false);
  }, [finalScore, gameState.gameTime, gameState.kills, gameState.player.level]);

  const handleSkipInitials = useCallback(() => {
    setShowInitialInput(false);
  }, []);

  const handleSelectUpgrade = useCallback((upgrade: Upgrade) => {
    setGameState((prev) => {
      const { player, weapon, orbitals } = upgrade.apply(prev.player, prev.weapon, prev.orbitals);
      return {
        ...prev,
        player,
        weapon,
        orbitals,
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

        let { player, enemies, projectiles, xpGems, explosions, orbitals, weapon, gameTime, kills } = prev;

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
            pendingSoundsRef.current.shoots++;
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

        // Update orbitals rotation
        orbitals = orbitals.map((orbital) => ({
          ...orbital,
          angle: orbital.angle + orbital.rotationSpeed * deltaTime,
        }));

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
        const newExplosions: Explosion[] = [];
        let projectilesToRemove: Set<string> = new Set();
        
        enemies = enemies.filter((enemy) => {
          // Check projectile collisions
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
                pendingSoundsRef.current.explosions++;
                newXpGems.push(createXpGem(enemy.x, enemy.y, enemy.type === 'tank' ? 5 : enemy.type === 'fast' ? 2 : 3));
                const explosionColor = enemy.type === 'fast' ? 'hsl(30, 100%, 50%)' : 
                                       enemy.type === 'tank' ? 'hsl(0, 60%, 50%)' : 'hsl(0, 72%, 51%)';
                newExplosions.push({
                  id: `exp-${Date.now()}-${Math.random()}`,
                  x: enemy.x,
                  y: enemy.y,
                  startTime: gameTime,
                  duration: 0.3,
                  size: enemy.size * 2,
                  color: explosionColor,
                });
                return false;
              }
            }
          }

          // Check orbital collisions
          for (const orbital of orbitals) {
            const orbX = player.x + Math.cos(orbital.angle) * orbital.orbitRadius;
            const orbY = player.y + Math.sin(orbital.angle) * orbital.orbitRadius;
            const dist = distance(orbX, orbY, enemy.x, enemy.y);
            
            if (dist < orbital.size + enemy.size) {
              enemy.health -= orbital.damage * deltaTime * 10; // Continuous damage
              
              if (enemy.health <= 0) {
                kills++;
                pendingSoundsRef.current.explosions++;
                newXpGems.push(createXpGem(enemy.x, enemy.y, enemy.type === 'tank' ? 5 : enemy.type === 'fast' ? 2 : 3));
                // Orbital explosion - purple spiral effect
                newExplosions.push({
                  id: `exp-orbital-${Date.now()}-${Math.random()}`,
                  x: enemy.x,
                  y: enemy.y,
                  startTime: gameTime,
                  duration: 0.5,
                  size: enemy.size * 3,
                  color: 'hsl(280, 100%, 60%)',
                  isOrbital: true,
                });
                return false;
              }
            }
          }

          return true;
        });

        projectiles = projectiles.filter((p) => !projectilesToRemove.has(p.id));
        xpGems = [...xpGems, ...newXpGems];
        
        // Update explosions (filter expired ones)
        explosions = [...explosions.filter(exp => gameTime - exp.startTime < exp.duration), ...newExplosions];

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
          pendingSoundsRef.current.levelUp = true;
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
          explosions,
          orbitals,
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

  // Play sounds outside of state update
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingSoundsRef.current.shoots > 0) {
        playShoot();
        pendingSoundsRef.current.shoots = 0;
      }
      if (pendingSoundsRef.current.explosions > 0) {
        playExplosion();
        pendingSoundsRef.current.explosions = 0;
      }
      if (pendingSoundsRef.current.levelUp) {
        playLevelUp();
        pendingSoundsRef.current.levelUp = false;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [playShoot, playExplosion, playLevelUp]);

  // Game over sound and BGM stop
  useEffect(() => {
    if (gameState.isGameOver && !gameOverSoundPlayed.current) {
      gameOverSoundPlayed.current = true;
      stopBgm();
      playGameOver();
    }
  }, [gameState.isGameOver, stopBgm, playGameOver]);

  useGameLoop(gameLoop, gameStarted && !gameState.isGameOver && !gameState.isLevelingUp);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Game will use new dimensions on reset
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show rotate overlay if mobile and not in landscape
  if (needsRotation) {
    return <RotateDeviceOverlay />;
  }

  if (!gameStarted) {
    return (
      <div className="game-container">
        <StartScreen 
          onStart={handleStart} 
          isMobile={isMobileDevice}
          onRequestFullscreen={requestFullscreen}
        />
        <div className="absolute bottom-4 left-4 z-10 w-80 hidden sm:block">
          <Leaderboard />
        </div>
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
        <PauseScreen />
      )}

      <GameHUD
        player={gameState.player}
        weapon={gameState.weapon}
        gameTime={gameState.gameTime}
        kills={gameState.kills}
        isMobile={isMobileDevice}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {isMobile && <VirtualJoystick joystickPosition={joystickPosition} />}

      {gameState.isLevelingUp && (
        <LevelUpScreen
          upgrades={gameState.availableUpgrades}
          onSelectUpgrade={handleSelectUpgrade}
          level={gameState.player.level}
        />
      )}

      {showInitialInput && (
        <InitialInputScreen
          rank={topTenRank}
          score={finalScore}
          onSubmit={handleSubmitInitials}
          onSkip={handleSkipInitials}
        />
      )}

      {gameState.isGameOver && !showInitialInput && (
        <GameOverScreen
          gameTime={gameState.gameTime}
          kills={gameState.kills}
          level={gameState.player.level}
          onRestart={handleRestart}
          score={finalScore}
        />
      )}
    </div>
  );
};
