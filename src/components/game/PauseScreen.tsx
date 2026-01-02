import React from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Keyboard, Crosshair, Circle, Skull, Lightbulb } from 'lucide-react';

export const PauseScreen: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center text-white max-w-2xl mx-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">{t('paused')}</h2>
        
        <div className="bg-card/50 rounded-lg p-6 mb-6 text-left border border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            {t('gameGuide')}
          </h3>
          
          {/* Controls */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t('controls')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-background/30 rounded px-3 py-2">{t('guideMovement')}</div>
              <div className="bg-background/30 rounded px-3 py-2">{t('guidePause')}</div>
              <div className="bg-background/30 rounded px-3 py-2">{t('guideSound')}</div>
            </div>
          </div>
          
          {/* Weapons */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-purple-400">{t('guideWeapon')}</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{t('guideWeaponDesc')}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Circle className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-semibold text-yellow-400">{t('guideOrbital')}</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{t('guideOrbitalDesc')}</p>
          </div>
          
          {/* Enemy Types */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Skull className="w-4 h-4 text-red-400" />
              <h4 className="text-sm font-semibold text-red-400">{t('guideEnemies')}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm pl-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-muted-foreground">{t('guideNormal')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-muted-foreground">{t('guideFast')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-900"></span>
                <span className="text-muted-foreground">{t('guideTank')}</span>
              </div>
            </div>
          </div>
          
          {/* Tip */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-green-400" />
              <h4 className="text-sm font-semibold text-green-400">{t('guideTip')}</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{t('guideTipDesc')}</p>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground animate-pulse">{t('pressToContinue')}</p>
      </div>
    </div>
  );
};
