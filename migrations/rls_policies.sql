-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE eval_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE evals ENABLE ROW LEVEL SECURITY;

-- Users table policies (users can only see their own record)
CREATE POLICY "Users can view own record" ON users
  FOR SELECT
  USING (id = current_setting('app.user_id', true)::uuid);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE
  USING (id = current_setting('app.user_id', true)::uuid);

-- Eval settings policies (users can only access their own settings)
CREATE POLICY "Users can view own settings" ON eval_settings
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::uuid);

CREATE POLICY "Users can insert own settings" ON eval_settings
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::uuid);

CREATE POLICY "Users can update own settings" ON eval_settings
  FOR UPDATE
  USING (user_id = current_setting('app.user_id', true)::uuid);

-- Evaluations policies (users can only access their own evaluations)
CREATE POLICY "Users can view own evaluations" ON evals
  FOR SELECT
  USING (user_id = current_setting('app.user_id', true)::uuid);

CREATE POLICY "Users can insert own evaluations" ON evals
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.user_id', true)::uuid);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
