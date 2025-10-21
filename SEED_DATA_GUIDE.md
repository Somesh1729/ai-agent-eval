# Seeding the Database with AI Agent Data

This guide explains how to populate your dashboard with realistic AI agent evaluation data.

## Why Seed Data?

The seed script creates:
- **5 different AI agents** with realistic configurations
- **500-750 evaluation records** across all agents
- **Realistic metrics** (scores, latency, flags, PII redaction)
- **Historical data** spanning the last 60 days
- **Demo user account** for testing

## AI Agents Included

1. **Customer Support Bot** - Handles customer inquiries
   - Focus: Support tickets and FAQs
   - Avg Score: ~0.85
   - Avg Latency: ~800ms

2. **Content Generator** - Creates marketing content
   - Focus: Product descriptions, social media posts
   - Avg Score: ~0.82
   - Avg Latency: ~800ms

3. **Code Assistant** - Helps with coding
   - Focus: Debugging, explanations, best practices
   - Avg Score: ~0.80
   - Avg Latency: ~2000ms (more complex)

4. **Data Analyst** - Analyzes data and insights
   - Focus: Metrics, trends, correlations
   - Avg Score: ~0.80
   - Avg Latency: ~1500ms

5. **HR Assistant** - Handles HR queries
   - Focus: Policies, benefits, requests
   - Avg Score: ~0.80
   - Avg Latency: ~800ms

## How to Run the Seed Script

### Step 1: Set Environment Variables

Make sure your `.env.local` file has:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Step 2: Run the Seed Script

\`\`\`bash
npm run seed
\`\`\`

You should see output like:
\`\`\`
Starting enhanced seed with AI agents...

Using user ID: xxxxx
✓ Created evaluation settings

Generating 120 evaluations for "Customer Support Bot"...
✓ Completed Customer Support Bot

Generating 95 evaluations for "Content Generator"...
✓ Completed Content Generator

... (more agents)

==================================================
SEED COMPLETED SUCCESSFULLY!
==================================================

Total evaluations created: 650
AI Agents seeded: 5

Login credentials:
Email: demo@example.com
Password: DemoPassword123!
\`\`\`

### Step 3: Log In and View Data

1. Go to `http://localhost:3000`
2. Click "Sign In"
3. Use credentials:
   - Email: `demo@example.com`
   - Password: `DemoPassword123!`
4. You'll be redirected to the dashboard
5. You should now see:
   - **KPI Cards** with real metrics
   - **Trend Charts** showing 7-day and 30-day trends
   - **Evaluations Table** with all the seeded data

## What You'll See on the Dashboard

### KPI Cards
- **Average Score**: ~0.81 (across all agents)
- **Average Latency**: ~1200ms
- **Redaction Rate**: ~30% (PII tokens redacted)
- **Success Rate**: ~95% (evaluations without errors)

### Trend Charts
- **7-Day Trend**: Shows recent performance
- **30-Day Trend**: Shows longer-term patterns

### Evaluations Table
- Lists all 650+ evaluations
- Sortable by score, latency, date
- Searchable by interaction ID
- Click to view full details

## Understanding the Data

### Score
- Range: 0.0 to 1.0
- Higher is better
- Represents quality of AI response
- Example: 0.95 = excellent, 0.50 = poor

### Latency (ms)
- Response time in milliseconds
- Lower is better
- Typical range: 50-5000ms
- Example: 800ms = good, 5000ms = slow

### Flags
- Indicate issues or special conditions
- Examples: "success", "error", "timeout", "rate_limit"
- Multiple flags possible per evaluation

### PII Tokens Redacted
- Number of personally identifiable information tokens removed
- Higher = more sensitive data was found and redacted
- Important for compliance and privacy

## Testing the API

You can also test the API endpoint directly:

\`\`\`bash
curl -X POST http://localhost:3000/api/evals/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "interaction_id": "test-123",
    "prompt": "What is machine learning?",
    "response": "Machine learning is a subset of AI...",
    "score": 0.92,
    "latency_ms": 450,
    "flags": ["success"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

Expected response:
\`\`\`json
{
  "status": "accepted",
  "message": "Evaluation recorded"
}
\`\`\`

## Troubleshooting

### "Cannot find module '@faker-js/faker'"
- Run: `npm install`
- Make sure `@faker-js/faker` is in package.json

### "Missing environment variables"
- Check your `.env.local` file
- Verify all three Supabase keys are set
- Restart the seed script

### "User already exists"
- The script will reuse the existing demo@example.com user
- All new evaluations will be added to their account

### Dashboard shows 0 metrics
- Make sure the seed script completed successfully
- Check Supabase dashboard to verify data was inserted
- Refresh the dashboard page
- Check browser console for errors

## Next Steps

1. **Explore the Dashboard**
   - View different time periods
   - Filter by agent type
   - Analyze trends

2. **Configure Settings**
   - Go to Settings page
   - Adjust sampling rate
   - Set daily limits

3. **Integrate with Your AI System**
   - Use the API endpoint to send real evaluations
   - Monitor performance over time
   - Set up alerts for issues

4. **Customize for Your Needs**
   - Modify the seed script to match your agents
   - Add more evaluation data
   - Create custom dashboards

## Questions?

Refer to the main README.md for more information about the application architecture and features.
