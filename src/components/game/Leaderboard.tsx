import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/hooks/useI18n';
import { GameTheme } from '@/types/game';
import { Cat, Rocket } from 'lucide-react';

interface HighScore {
  id: string;
  initials: string;
  score: number;
  survival_time: number;
  kills: number;
  level: number;
  theme: string;
}

interface LeaderboardProps {
  currentScore?: number;
  showUserRank?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, showUserRank = false }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { t } = useI18n();

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

  // Check user rank when currentScore changes
  useEffect(() => {
    if (showUserRank && currentScore !== undefined) {
      checkUserRank(currentScore);
    }
  }, [currentScore, showUserRank]);

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

  const checkUserRank = async (score: number) => {
    const { data, error } = await supabase
      .from('high_scores')
      .select('score')
      .gt('score', score);
    
    if (!error && data) {
      const rank = data.length + 1;
      if (rank > 10) {
        setUserRank(rank);
      } else {
        setUserRank(null);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ThemeIcon = ({ theme }: { theme: string }) => {
    if (theme === 'cat') {
      return <Cat className="w-4 h-4 text-amber-500" />;
    }
    return <Rocket className="w-4 h-4 text-cyan-500" />;
  };

  if (loading) {
    return (
      <div className="bg-card/80 rounded-lg p-4 border border-border">
        <h3 className="text-lg font-bold text-primary mb-3 text-center">{t('leaderboard')}</h3>
        <p className="text-center text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 rounded-lg p-4 border border-border">
      <h3 className="text-lg font-bold text-primary mb-3 text-center">{t('leaderboard')}</h3>
      
      {scores.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">{t('noRecords')}</p>
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
                <ThemeIcon theme={score.theme || 'space'} />
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-primary font-bold">{score.score.toLocaleString()}</span>
                <span className="text-xs">{formatTime(score.survival_time)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Show user rank if outside top 10 */}
      {showUserRank && userRank && userRank > 10 && (
        <div className="mt-4 pt-3 border-t border-border text-center">
          <span className="text-muted-foreground">
            {t('yourRank')}: <span className="text-primary font-bold">{userRank}{t('rank')}</span>
          </span>
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
  level: number,
  theme: GameTheme = 'space'
): Promise<boolean> => {
  const { error } = await supabase.from('high_scores').insert({
    initials: initials.toUpperCase().slice(0, 5),
    score,
    survival_time: Math.floor(survivalTime),
    kills,
    level,
    theme,
  });

  return !error;
};
