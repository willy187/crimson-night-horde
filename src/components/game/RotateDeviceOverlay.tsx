import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export const RotateDeviceOverlay: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center text-center p-8">
      <RotateCcw className="w-24 h-24 text-primary animate-spin-slow mb-8" />
      <h2 className="text-2xl font-bold text-primary mb-4">
        {t('rotateDevice')}
      </h2>
      <p className="text-muted-foreground">
        {t('landscapeOnly')}
      </p>
    </div>
  );
};
