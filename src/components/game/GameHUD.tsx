import React, { useState, useEffect } from 'react';
import { Player, Weapon } from '@/types/game';
import { Minimize2 } from 'lucide-react';

interface GameHUDProps {
  player: Player;
  weapon: Weapon;
  gameTime: number;
  kills: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  weapon,
  gameTime,
  kills,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Check initial state
    setIsFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const healthPercent = (player.health / player.maxHealth) * 100;
  const xpPercent = (player.xp / player.xpToNextLevel) * 100;

  return (
    <div className="hud">
      {/* Fullscreen exit button */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/30 text-primary hover:bg-background transition-colors"
          title="전체화면 종료"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      )}

      {/* Left side - Player stats */}
      <div className="hud-panel min-w-[200px]">
        <div className="text-xs text-muted-foreground mb-1">HEALTH</div>
        <div className="health-bar mb-2">
          <div
            className="health-fill"
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <div className="text-xs text-foreground mb-2">
          {Math.ceil(player.health)} / {player.maxHealth}
        </div>
        
        <div className="text-xs text-muted-foreground mb-1">
          LEVEL {player.level}
        </div>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <div className="text-xs text-accent mt-1">
          {player.xp} / {player.xpToNextLevel} XP
        </div>
      </div>

      {/* Center - Time */}
      <div className="hud-panel">
        <div className="text-2xl font-bold text-primary font-pixel">
          {formatTime(gameTime)}
        </div>
      </div>

      {/* Right side - Stats */}
      <div className="hud-panel text-right min-w-[150px]">
        <div className="text-xs text-muted-foreground">KILLS</div>
        <div className="text-xl font-bold text-destructive">{kills}</div>
        
        <div className="mt-2 text-xs text-muted-foreground">DAMAGE</div>
        <div className="text-sm text-primary">{weapon.damage.toFixed(0)}</div>
        
        <div className="mt-1 text-xs text-muted-foreground">PROJECTILES</div>
        <div className="text-sm text-primary">{weapon.projectileCount}</div>
      </div>
    </div>
  );
};
