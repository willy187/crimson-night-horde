import React from 'react';
import { Upgrade } from '@/types/game';

interface LevelUpScreenProps {
  upgrades: Upgrade[];
  onSelectUpgrade: (upgrade: Upgrade) => void;
  level: number;
}

export const LevelUpScreen: React.FC<LevelUpScreenProps> = ({
  upgrades,
  onSelectUpgrade,
  level,
}) => {
  return (
    <div className="level-up-overlay animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-2 title-glow font-pixel">
          LEVEL UP!
        </h2>
        <p className="text-xl text-accent mb-8">Level {level}</p>
        
        <p className="text-muted-foreground mb-6">업그레이드를 선택하세요</p>
        
        <div className="flex gap-4 justify-center">
          {upgrades.map((upgrade) => (
            <button
              key={upgrade.id}
              onClick={() => onSelectUpgrade(upgrade)}
              className="upgrade-card w-48 text-center"
            >
              <div className="text-4xl mb-4">{upgrade.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {upgrade.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {upgrade.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
