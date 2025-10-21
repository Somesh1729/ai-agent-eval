# Quick Start: Seed Your Database

## 3 Simple Steps

### Step 1: Ensure Environment Variables
Check your `.env.local` has these three variables:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
\`\`\`

### Step 2: Run the Seed Script
\`\`\`bash
npm run seed
\`\`\`

Wait for it to complete (takes 30-60 seconds). You'll see:
\`\`\`
✓ Completed Customer Support Bot
✓ Completed Content Generator
✓ Completed Code Assistant
✓ Completed Data Analyst
✓ Completed HR Assistant

SEED COMPLETED SUCCESSFULLY!
Total evaluations created: 650
\`\`\`

### Step 3: Log In and View Dashboard
1. Go to `http://localhost:3000`
2. Click "Sign In"
3. Use:
   - Email: `demo@example.com`
   - Password: `DemoPassword123!`
4. You'll see the dashboard with real data!

## What You'll See

✓ **KPI Cards** - Average score, latency, redaction rate, success rate
✓ **Trend Charts** - 7-day and 30-day performance trends
✓ **Evaluations Table** - 650+ evaluation records
✓ **Real Metrics** - Realistic scores, latencies, and flags

## That's It!

Your dashboard is now fully populated with AI agent evaluation data. Explore the metrics, configure settings, and test the API endpoint.

For more details, see `SEED_DATA_GUIDE.md`
