# Quick Start Guide

## 1️⃣ Environment Variables (Already Set)
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY

## 2️⃣ Create Database Schema

Go to your Supabase project → SQL Editor and run:

### Script 1: Create Tables
Copy and paste the contents of `scripts/001_create_tables.sql`

### Script 2: Create RLS Policies
Copy and paste the contents of `scripts/002_rls_policies.sql`

## 3️⃣ Test the App

### Option A: Run Locally
\`\`\`bash
npm install
npm run dev
# Visit http://localhost:3000
\`\`\`

### Option B: Deploy to Vercel
\`\`\`bash
git push origin main
# Vercel will auto-deploy
\`\`\`

## 4️⃣ Create Your First Account

1. Visit http://localhost:3000 (or your deployed URL)
2. Click "Sign Up"
3. Enter email and password
4. Confirm email (check spam folder)
5. Login with your credentials

## 5️⃣ Configure Settings

1. Go to Settings page
2. Choose run policy (Always or Sampled)
3. Set sample rate if sampled
4. Set max evaluations per day
5. Toggle PII obfuscation
6. Click "Save Settings"

## 6️⃣ Submit Your First Evaluation

\`\`\`bash
curl -X POST http://localhost:3000/api/evals/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "interaction_id": "test-1",
    "prompt": "What is AI?",
    "response": "AI is artificial intelligence",
    "score": 0.9,
    "latency_ms": 100,
    "flags": ["correct"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

## 7️⃣ View Dashboard

1. Login to your account
2. Go to Dashboard
3. See KPIs and trends
4. Search evaluations
5. Click "View" to see details

## 📱 Pages

- `/` - Landing page
- `/auth/login` - Login
- `/auth/sign-up` - Sign up
- `/dashboard` - Main dashboard
- `/settings` - Evaluation settings

## 🆘 Need Help?

### App won't load
- Check environment variables in Vercel
- Verify Supabase project is active
- Check browser console for errors

### Can't login
- Verify email is correct
- Check password requirements
- Confirm email if needed

### No data showing
- Create evaluations via API
- Or run seed script: `npm run seed:supabase`
- Check RLS policies are enabled

---

**You're all set! 🎉**
