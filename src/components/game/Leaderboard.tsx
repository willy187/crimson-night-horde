import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HighScore {
  id: string;
  initials: string;
  score: number;
  survival_time: number;
  kills: number;
  level: number;
}

interface LeaderboardProps {
  currentScore?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('high_scores_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'high_scores',
        },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (!error && data) {
      setScores(data);
    }
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-card/80 rounded-lg p-4 border border-border">
        <h3 className="text-lg font-bold text-primary mb-3 text-center">🏆 리더보드</h3>
        <p className="text-center text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 rounded-lg p-4 border border-border">
      <h3 className="text-lg font-bold text-primary mb-3 text-center">🏆 리더보드</h3>
      
      {scores.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">아직 기록이 없습니다</p>
      ) : (
        <div className="space-y-1">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`flex items-center justify-between text-sm py-1 px-2 rounded ${
                index < 3 ? 'bg-primary/10' : ''
              } ${currentScore === score.score ? 'bg-accent/20 border border-accent/50' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold w-6 ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-300' :
                  index === 2 ? 'text-amber-600' :
                  'text-muted-foreground'
                }`}>
                  {index + 1}.
                </span>
                <span className="font-mono font-bold text-foreground">{score.initials}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-primary font-bold">{score.score.toLocaleString()}</span>
                <span className="text-xs">{formatTime(score.survival_time)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to check if score qualifies for top 10
export const checkTopTen = async (score: number): Promise<{ qualifies: boolean; rank: number }> => {
  const { data, error } = await supabase
    .from('high_scores')
    .select('score')
    .order('score', { ascending: false })
    .limit(10);

  if (error || !data) {
    return { qualifies: false, rank: 0 };
  }

  // If less than 10 scores, automatically qualifies
  if (data.length < 10) {
    const rank = data.filter(s => s.score > score).length + 1;
    return { qualifies: true, rank };
  }

  // Check if score is higher than the lowest in top 10
  const lowestScore = data[data.length - 1].score;
  if (score > lowestScore) {
    const rank = data.filter(s => s.score > score).length + 1;
    return { qualifies: true, rank };
  }

  return { qualifies: false, rank: 0 };
};

// Helper function to submit a high score
export const submitHighScore = async (
  initials: string,
  score: number,
  survivalTime: number,
  kills: number,
  level: number
): Promise<boolean> => {
  const { error } = await supabase.from('high_scores').insert({
    initials: initials.toUpperCase().slice(0, 5),
    score,
    survival_time: Math.floor(survivalTime),
    kills,
    level,
  });

  return !error;
};
