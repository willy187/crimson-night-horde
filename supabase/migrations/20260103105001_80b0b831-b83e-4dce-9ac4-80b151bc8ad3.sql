-- Add theme column to high_scores table
ALTER TABLE public.high_scores 
ADD COLUMN theme TEXT NOT NULL DEFAULT 'space';