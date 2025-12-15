import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverScreenProps {
  gameTime: number;
  kills: number;
  level: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameTime,
  kills,
  level,
  onRestart,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}분 ${secs}초`;
  };

  return (
    <div className="game-over-overlay animate-fade-in">
      <h1 className="text-6xl font-bold text-destructive mb-8 font-pixel">
        GAME OVER
      </h1>
      
      <div className="bg-card rounded-xl p-8 border border-border mb-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{formatTime(gameTime)}</div>
            <div className="text-muted-foreground">생존 시간</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-destructive">{kills}</div>
            <div className="text-muted-foreground">처치 수</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">{level}</div>
            <div className="text-muted-foreground">달성 레벨</div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={onRestart}
        size="lg"
        className="text-xl px-8 py-6 bg-primary hover:bg-primary/80"
      >
        다시 시작
      </Button>
    </div>
  );
};
