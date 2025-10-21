-- Create eval_settings table
CREATE TABLE IF NOT EXISTS public.eval_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_policy TEXT NOT NULL DEFAULT 'always' CHECK (run_policy IN ('always', 'sampled')),
  sample_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 100 CHECK (sample_rate_pct >= 0 AND sample_rate_pct <= 100),
  obfuscate_pii BOOLEAN NOT NULL DEFAULT false,
  max_eval_per_day INTEGER NOT NULL DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create evals table
CREATE TABLE IF NOT EXISTS public.evals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  score NUMERIC(3, 2) NOT NULL CHECK (score >= 0 AND score <= 1),
  latency_ms INTEGER NOT NULL,
  flags TEXT[] DEFAULT '{}',
  pii_tokens_redacted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_eval_settings_user_id ON public.eval_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_evals_user_id ON public.evals(user_id);
CREATE INDEX IF NOT EXISTS idx_evals_created_at ON public.evals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evals_user_created ON public.evals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evals_score ON public.evals(score);

-- Enable Row Level Security
ALTER TABLE public.eval_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evals ENABLE ROW LEVEL SECURITY;
