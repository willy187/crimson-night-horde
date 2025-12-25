import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HighScore {
  id: string;
  initials: string;
  score: number;
}

interface LeaderboardTickerProps {
  direction?: 'left' | 'right';
}

export const LeaderboardTicker: React.FC<LeaderboardTickerProps> = ({ direction = 'left' }) => {
  const [scores, setScores] = useState<HighScore[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from('high_scores')
        .select('id, initials, score')
        .order('score', { ascending: false })
        .limit(10);
      
      if (data) {
        setScores(data);
      }
    };

    fetchScores();

    const channel = supabase
      .channel('ticker-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'high_scores' },
        () => fetchScores()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (scores.length === 0) {
    return null;
  }

  const tickerContent = scores.map((score, index) => (
    <span key={score.id} className="inline-flex items-center gap-2 mx-8">
      <span className="text-primary font-bold">#{index + 1}</span>
      <span className="text-accent font-semibold">{score.initials}</span>
      <span className="text-muted-foreground">{score.score.toLocaleString()}점</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden bg-background/80 backdrop-blur-sm border-y border-primary/30 py-2">
      <div 
        className={`inline-flex whitespace-nowrap ${
          direction === 'left' ? 'animate-ticker-left' : 'animate-ticker-right'
        }`}
      >
        {tickerContent}
        {tickerContent}
        {tickerContent}
      </div>
    </div>
  );
};
