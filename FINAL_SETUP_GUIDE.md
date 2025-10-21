# AI Agent Evaluation Dashboard - Final Setup Guide

## Overview
This is a production-ready Next.js application for monitoring and analyzing AI agent performance with Supabase backend.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

## Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 2: Set Up Supabase

### Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for the project to initialize

### Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Add Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Step 3: Create Database Schema

### Option A: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `scripts/001_create_tables.sql`
5. Click **Run**
6. Repeat for `scripts/002_rls_policies.sql`

### Option B: Using the Seed Script
\`\`\`bash
npm run seed
\`\`\`

## Step 4: Disable Email Confirmation (Development Only)

1. Go to your Supabase project
2. Click **Authentication** → **Providers** → **Email**
3. Toggle off **"Confirm email"**
4. Click **Save**

For production, keep email confirmation enabled and implement proper email verification flow.

## Step 5: Run the Application

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

## Features

### Landing Page
- Professional hero section
- Feature highlights
- Quick navigation to login/signup

### Authentication
- Email/password signup
- Email/password login
- Session management with Supabase Auth
- Protected routes

### Dashboard
- Real-time KPI cards (score, latency, redaction rate, success rate)
- 7-day and 30-day trend charts
- Searchable evaluations table
- Detailed evaluation viewer

### Settings
- Configure run policy (always/sampled)
- Set sample rate (0-100%)
- Set daily evaluation limit
- Toggle PII obfuscation

### API Endpoint
- `POST /api/evals/ingest` - Submit evaluations
- Validates required fields
- Enforces sampling policies
- Respects daily limits

## Database Schema

### eval_settings Table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `run_policy` - 'always' or 'sampled'
- `sample_rate_pct` - 0-100
- `obfuscate_pii` - boolean
- `max_eval_per_day` - integer
- `created_at` - timestamp

### evals Table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `interaction_id` - string
- `prompt` - text
- `response` - text
- `score` - 0-100
- `latency_ms` - integer
- `flags` - JSON array
- `pii_tokens_redacted` - integer
- `created_at` - timestamp

## API Usage

### Submit an Evaluation

\`\`\`bash
curl -X POST http://localhost:3000/api/evals/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "interaction_id": "interaction_123",
    "prompt": "What is 2+2?",
    "response": "The answer is 4",
    "score": 95,
    "latency_ms": 150,
    "flags": ["correct", "fast"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click **New Project**
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**

## Troubleshooting

### "Email not confirmed" Error
- Go to Supabase Authentication settings
- Disable "Confirm email" for development
- Or check your email for confirmation link

### "Failed to fetch" Error
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure network connectivity

### Database Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is running

## Security Notes

- Row-Level Security (RLS) is enabled on all tables
- Users can only see their own data
- Service role key should never be exposed to the client
- Always use HTTPS in production
- Rotate API keys regularly

## Performance Optimization

- Database indexes on user_id and created_at
- Pagination on evaluations table (100 rows per page)
- Efficient trend calculations with date grouping
- Optimized queries for 20,000+ evaluations

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs
