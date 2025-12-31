import React from 'react';
import { Upgrade } from '@/types/game';
import { useI18n } from '@/hooks/useI18n';

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
  const { t } = useI18n();

  return (
    <div className="level-up-overlay animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-2 title-glow font-pixel">
          {t('levelUp')}
        </h2>
        <p className="text-xl text-accent mb-8">{t('level')} {level}</p>
        
        <p className="text-muted-foreground mb-6">{t('selectUpgrade')}</p>
        
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
