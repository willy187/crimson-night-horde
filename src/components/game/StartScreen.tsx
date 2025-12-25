import React from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardTicker } from './LeaderboardTicker';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="start-screen">
      {/* Top Ticker */}
      <div className="absolute top-0 left-0 right-0">
        <LeaderboardTicker direction="left" />
      </div>

      <div className="text-center animate-float">
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 title-glow font-pixel">
          SURVIVOR
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          끝없는 적들로부터 살아남아라
        </p>
      </div>
      
      <Button
        onClick={onStart}
        size="lg"
        className="text-xl px-12 py-8 bg-primary hover:bg-primary/80 animate-pulse-glow"
      >
        게임 시작
      </Button>
      
      <div className="mt-12 text-center text-muted-foreground">
        <p className="mb-2">조작법</p>
        <div className="flex gap-8 justify-center">
          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-muted rounded text-sm">W A S D</kbd>
            <span>이동</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-muted rounded text-sm">↑ ← ↓ →</kbd>
            <span>이동</span>
          </div>
        </div>
        <p className="mt-4 text-sm">자동으로 가장 가까운 적을 공격합니다</p>
      </div>

      {/* Bottom Ticker */}
      <div className="absolute bottom-0 left-0 right-0">
        <LeaderboardTicker direction="right" />
      </div>
    </div>
  );
};
