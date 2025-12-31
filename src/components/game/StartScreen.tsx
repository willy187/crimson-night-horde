import React from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardTicker } from './LeaderboardTicker';
import { Maximize2, Smartphone } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface StartScreenProps {
  onStart: () => void;
  isMobile?: boolean;
  onRequestFullscreen?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  isMobile = false,
  onRequestFullscreen
}) => {
  const { t } = useI18n();

  const handleStart = () => {
    if (isMobile && onRequestFullscreen) {
      onRequestFullscreen();
    }
    onStart();
  };

  return (
    <div className="start-screen">
      {/* Top Ticker */}
      <div className="absolute top-0 left-0 right-0">
        <LeaderboardTicker direction="left" />
      </div>

      <div className="text-center animate-float">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-2 sm:mb-4 title-glow font-pixel text-center md:text-5xl">
          NIGHT SURVIVAL
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-12">
          {t('subtitle')}
        </p>
      </div>
      
      <Button 
        onClick={handleStart} 
        size="lg" 
        className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-primary hover:bg-primary/80 animate-pulse-glow flex items-center gap-2"
      >
        {isMobile && <Maximize2 className="w-5 h-5" />}
        {t('startGame')}
      </Button>

      {isMobile && (
        <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          {t('fullscreenInfo')}
        </p>
      )}
      
      <div className="mt-6 sm:mt-12 text-center text-muted-foreground">
        <p className="mb-2 text-sm sm:text-base">{t('controls')}</p>
        {isMobile ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs sm:text-sm">{t('touchControls')}</p>
            <p className="text-xs sm:text-sm text-muted-foreground/70">{t('autoAttack')}</p>
          </div>
        ) : (
          <>
            <div className="flex gap-4 sm:gap-8 justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <kbd className="px-2 sm:px-3 py-1 bg-muted rounded text-xs sm:text-sm">W A S D</kbd>
                <span className="text-sm">{t('movement')}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 sm:px-3 py-1 bg-muted rounded text-xs sm:text-sm">↑ ← ↓ →</kbd>
                <span className="text-sm">{t('movement')}</span>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-8 justify-center flex-wrap mt-3">
              <div className="flex items-center gap-2">
                <kbd className="px-2 sm:px-3 py-1 bg-muted rounded text-xs sm:text-sm">Space</kbd>
                <span className="text-sm">{t('pause')}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 sm:px-3 py-1 bg-muted rounded text-xs sm:text-sm">End</kbd>
                <span className="text-sm">{t('sound')}</span>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm">{t('autoAttack')}</p>
          </>
        )}
      </div>

      {/* Bottom Ticker */}
      <div className="absolute bottom-0 left-0 right-0">
        <LeaderboardTicker direction="right" />
      </div>
    </div>
  );
};
