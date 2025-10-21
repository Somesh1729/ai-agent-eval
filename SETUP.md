# AI Agent Evaluation Dashboard - Setup Guide

## Overview

This is a professional full-stack web application for managing and analyzing AI agent evaluations. Built with Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, and Supabase.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier available at supabase.com)
- Vercel account (optional, for deployment)

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your Vercel project or `.env.local` file:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

Get these from your Supabase project settings:
- Go to Settings → API
- Copy the Project URL and Anon Key
- Copy the Service Role Key (keep this secret!)

### 2. Database Setup

Run the SQL migrations to create tables and RLS policies:

1. Go to your Supabase project → SQL Editor
2. Create a new query and paste the contents of `scripts/001_create_tables.sql`
3. Run the query
4. Create another query and paste `scripts/002_rls_policies.sql`
5. Run the query

Alternatively, you can use the Supabase CLI to run migrations automatically.

### 3. Seed Data (Optional)

To populate the database with demo data:

\`\`\`bash
npm run seed
\`\`\`

This creates:
- Demo user: `demo@example.com` / `DemoPassword123!`
- 500-1000 random evaluations with realistic data
- Evaluation settings configured for the demo user

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Authentication
- Email/password signup and login
- Supabase Auth with email confirmation
- Protected routes with automatic redirects

### Evaluation Settings
- Configure collection policy (always or sampled)
- Set sample rate percentage
- Configure daily evaluation limits
- Enable/disable PII obfuscation

### API Endpoint
- `POST /api/evals/ingest` - Submit evaluations
- Validates payload and enforces policies
- Respects daily limits and sampling rules
- Returns 201 on success, 429 if limit reached, 202 if sampled out

### Dashboard
- **KPIs**: Average score, latency, redaction rate, success rate
- **Charts**: 7-day and 30-day trend lines for score and latency
- **Table**: Searchable evaluations with filtering
- **Detail View**: Full evaluation information in a side sheet

### Performance
- Indexed queries for fast retrieval
- Pagination support (100 evaluations per page)
- Efficient aggregation for trend calculations
- Handles 20,000+ rows efficiently

## Project Structure

\`\`\`
app/
  ├── auth/
  │   ├── login/page.tsx
  │   ├── sign-up/page.tsx
  │   ├── sign-up-success/page.tsx
  │   └── error/page.tsx
  ├── dashboard/page.tsx
  ├── settings/page.tsx
  ├── api/
  │   └── evals/
  │       └── ingest/route.ts
  └── layout.tsx

components/
  ├── kpi-card.tsx
  ├── eval-detail-sheet.tsx
  └── trend-chart.tsx

lib/
  └── supabase/
      ├── client.ts
      ├── server.ts
      └── middleware.ts

scripts/
  ├── 001_create_tables.sql
  ├── 002_rls_policies.sql
  └── seed-supabase.ts
\`\`\`

## API Usage Example

\`\`\`bash
curl -X POST http://localhost:3000/api/evals/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "interaction_id": "interaction-123",
    "prompt": "What is the capital of France?",
    "response": "The capital of France is Paris.",
    "score": 0.95,
    "latency_ms": 245,
    "flags": ["success"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Settings → Environment Variables
5. Deploy!

The app will be live at `your-project.vercel.app`

## Database Schema

### eval_settings
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `run_policy` (TEXT): 'always' or 'sampled'
- `sample_rate_pct` (NUMERIC): 0-100
- `obfuscate_pii` (BOOLEAN): Enable PII masking
- `max_eval_per_day` (INTEGER): Daily limit
- `created_at` (TIMESTAMP): Creation time
- `updated_at` (TIMESTAMP): Last update time

### evals
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `interaction_id` (TEXT): External interaction ID
- `prompt` (TEXT): Input prompt
- `response` (TEXT): AI response
- `score` (NUMERIC): 0-1 score
- `latency_ms` (INTEGER): Response time in milliseconds
- `flags` (TEXT[]): Array of flag strings
- `pii_tokens_redacted` (INTEGER): Count of redacted tokens
- `created_at` (TIMESTAMP): Creation time

## Row Level Security (RLS)

All tables have RLS enabled. Users can only see their own data:
- `eval_settings`: Users can only access their own settings
- `evals`: Users can only access their own evaluations

This is enforced at the database level for maximum security.

## Troubleshooting

### "Unauthorized" error on API calls
- Ensure you're authenticated (logged in)
- Check that your session token is valid
- Verify Supabase environment variables are correct

### "Daily evaluation limit reached"
- Check your settings page for the max_eval_per_day limit
- Increase the limit in settings if needed

### No data showing in dashboard
- Run the seed script: `npm run seed`
- Or submit evaluations via the API endpoint
- Check that you're logged in as the correct user

### Database connection errors
- Verify NEXT_PUBLIC_SUPABASE_URL and keys are correct
- Check that Supabase project is active
- Ensure RLS policies are properly set up

## Support

For issues or questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review Next.js docs: https://nextjs.org/docs
3. Check Shadcn UI components: https://ui.shadcn.com

## License

MIT
