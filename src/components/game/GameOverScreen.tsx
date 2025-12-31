import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaderboard } from './Leaderboard';
import { useI18n } from '@/hooks/useI18n';

interface GameOverScreenProps {
  gameTime: number;
  kills: number;
  level: number;
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameTime,
  kills,
  level,
  score,
  onRestart,
}) => {
  const { t } = useI18n();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}${t('minutes')} ${secs}${t('seconds')}`;
  };

  return (
    <div className="game-over-overlay animate-fade-in">
      <h1 className="text-6xl font-bold text-destructive mb-8 font-pixel">
        GAME OVER
      </h1>
      
      <div className="bg-card rounded-xl p-8 border border-border mb-8">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-primary">{score.toLocaleString()}</div>
          <div className="text-muted-foreground">{t('finalScore')}</div>
        </div>
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{formatTime(gameTime)}</div>
            <div className="text-muted-foreground">{t('survivalTime')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-destructive">{kills}</div>
            <div className="text-muted-foreground">{t('killCount')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">{level}</div>
            <div className="text-muted-foreground">{t('levelReached')}</div>
          </div>
        </div>
      </div>

      <div className="mb-8 w-80">
        <Leaderboard currentScore={score} />
      </div>
      
      <Button
        onClick={onRestart}
        size="lg"
        className="text-xl px-8 py-6 bg-primary hover:bg-primary/80"
      >
        {t('restart')}
      </Button>
    </div>
  );
};
