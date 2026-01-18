import React, { useState, useEffect } from 'react';
import { Player, Weapon, ActivePowerUp } from '@/types/game';
import { Minimize2, Volume2, VolumeX } from 'lucide-react';

interface GameHUDProps {
  player: Player;
  weapon: Weapon;
  gameTime: number;
  kills: number;
  isMobile?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  activePowerUps?: ActivePowerUp[];
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  weapon,
  gameTime,
  kills,
  isMobile = false,
  isMuted = false,
  onToggleMute,
  activePowerUps = [],
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

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
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* Sound toggle button */}
        <button
          onClick={onToggleMute}
          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/30 text-primary hover:bg-background transition-colors"
          title={isMuted ? "사운드 켜기" : "사운드 끄기"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Fullscreen exit button - Mobile only */}
        {isMobile && isFullscreen && (
          <button
            onClick={exitFullscreen}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/30 text-primary hover:bg-background transition-colors"
            title="전체화면 종료"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}
      </div>

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
        
        {/* Active power-ups */}
        {activePowerUps.length > 0 && (
          <div className="mt-3 pt-2 border-t border-primary/20">
            <div className="text-xs text-muted-foreground mb-1">POWER-UPS</div>
            <div className="flex gap-1 justify-end">
              {activePowerUps.map((ap, idx) => {
                const remaining = Math.max(0, ap.endTime - gameTime);
                const icon = ap.type === 'shield' ? '🛡️' : ap.type === 'magnet' ? '🧲' : '💣';
                return (
                  <div 
                    key={`${ap.type}-${idx}`}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-primary/20 text-xs"
                    title={`${ap.type} - ${remaining.toFixed(1)}s`}
                  >
                    <span>{icon}</span>
                    <span className="text-primary font-mono">{remaining.toFixed(0)}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
