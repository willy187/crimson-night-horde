import React from 'react';
import { RotateCcw } from 'lucide-react';

export const RotateDeviceOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center text-center p-8">
      <RotateCcw className="w-24 h-24 text-primary animate-spin-slow mb-8" />
      <h2 className="text-2xl font-bold text-primary mb-4">
        기기를 가로로 회전해주세요
      </h2>
      <p className="text-muted-foreground">
        이 게임은 가로 모드에서만 플레이할 수 있습니다
      </p>
    </div>
  );
};
