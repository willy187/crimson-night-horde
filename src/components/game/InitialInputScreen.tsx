import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';

interface InitialInputScreenProps {
  rank: number;
  score: number;
  onSubmit: (initials: string) => void;
  onSkip: () => void;
}

export const InitialInputScreen: React.FC<InitialInputScreenProps> = ({
  rank,
  score,
  onSubmit,
  onSkip,
}) => {
  const [initials, setInitials] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.trim().length > 0) {
      onSubmit(initials.trim().toUpperCase());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 5);
    setInitials(value);
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-xl p-8 border border-primary/50 text-center max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-2">{t('topTenEntry')}</h2>
        <p className="text-xl text-accent mb-4">
          {t('rankScore', { rank, score: score.toLocaleString() })}
        </p>
        
        <p className="text-muted-foreground mb-6">
          {t('enterInitials')}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={initials}
            onChange={handleChange}
            placeholder="AAA"
            maxLength={5}
            className="text-center text-3xl font-bold tracking-widest h-16 bg-background border-primary/30 focus:border-primary"
            autoFocus
          />
          
          <div className="flex gap-4 justify-center">
            <Button
              type="submit"
              disabled={initials.trim().length === 0}
              className="px-8 py-3 text-lg"
            >
              {t('register')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="px-8 py-3 text-lg"
            >
              {t('skip')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
