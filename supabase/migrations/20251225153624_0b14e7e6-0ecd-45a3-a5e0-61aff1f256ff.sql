-- Create high_scores table for leaderboard
CREATE TABLE public.high_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initials VARCHAR(5) NOT NULL,
  score INTEGER NOT NULL,
  survival_time INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.high_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view high scores (public leaderboard)
CREATE POLICY "Anyone can view high scores"
ON public.high_scores
FOR SELECT
USING (true);

-- Allow anyone to insert high scores (no auth required for arcade game)
CREATE POLICY "Anyone can insert high scores"
ON public.high_scores
FOR INSERT
WITH CHECK (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_high_scores_score ON public.high_scores(score DESC);

-- Enable realtime for high_scores table
ALTER PUBLICATION supabase_realtime ADD TABLE public.high_scores;