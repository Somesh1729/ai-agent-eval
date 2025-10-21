# Quick Start Commands

## 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

## 2. Set Up Environment Variables
Create `.env.local` in project root:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

## 3. Create Database Tables
Open Supabase SQL Editor and run:

**First, run this:**
\`\`\`sql
-- Create tables and indexes
CREATE TABLE IF NOT EXISTS eval_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_policy TEXT DEFAULT 'always',
  sample_rate_pct INTEGER DEFAULT 100,
  obfuscate_pii BOOLEAN DEFAULT false,
  max_eval_per_day INTEGER DEFAULT 10000,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS evals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  score FLOAT NOT NULL,
  latency_ms INTEGER NOT NULL,
  flags TEXT[] DEFAULT '{}',
  pii_tokens_redacted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_evals_user_id ON evals(user_id);
CREATE INDEX idx_evals_created_at ON evals(created_at);
CREATE INDEX idx_eval_settings_user_id ON eval_settings(user_id);
\`\`\`

**Then, run this:**
\`\`\`sql
-- Enable RLS
ALTER TABLE eval_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE evals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings" ON eval_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON eval_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON eval_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own evals" ON evals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evals" ON evals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
\`\`\`

## 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

## 5. Test the Application

### Sign Up
1. Click "Sign Up"
2. Enter email: test@example.com
3. Enter password: TestPassword123!
4. Confirm password
5. Click "Sign up"

### Login
1. Click "Login"
2. Enter email: test@example.com
3. Enter password: TestPassword123!
4. Click "Login"

### Access Dashboard
- View KPIs and charts
- Check evaluation data
- Configure settings

## 6. Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 7. Deploy to Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Troubleshooting

### Port 3000 Already in Use
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Clear Cache
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### Reset Database
1. Go to Supabase Dashboard
2. Click "Reset Database"
3. Re-run the SQL scripts above

### Check Logs
\`\`\`bash
# Terminal where npm run dev is running
# Look for errors in the output
