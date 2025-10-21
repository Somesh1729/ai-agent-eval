# AI Agent Evaluation Dashboard - Complete Guide

## What is This Application?

The **AI Agent Evaluation Dashboard** is a professional full-stack web application designed to monitor, track, and analyze the performance of AI agents and LLM (Large Language Model) systems in production environments.

### Real-World Use Cases:

1. **AI/LLM Monitoring**: Track how well your AI agents are performing
2. **Quality Assurance**: Monitor response quality, latency, and error rates
3. **Performance Analytics**: Identify trends and bottlenecks in AI system performance
4. **Compliance & Auditing**: Track PII (Personally Identifiable Information) redaction and data privacy
5. **Cost Optimization**: Monitor latency and resource usage to optimize costs
6. **A/B Testing**: Compare different AI models or prompts using evaluation scores

---

## How Does This Application Work?

### Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Landing    │  │   Dashboard  │  │   Settings   │       │
│  │    Page      │  │    (KPIs)    │  │  (Config)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Next.js Route Handlers)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  POST /api/evals/ingest - Receive evaluation data    │   │
│  │  - Validates input                                   │   │
│  │  - Applies sampling policies                         │   │
│  │  - Enforces daily limits                             │   │
│  │  - Redacts PII if configured                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (Supabase PostgreSQL)            │
│  ┌──────────────────┐  ┌──────────────────────────────┐     │
│  │  eval_settings   │  │  evals                       │     │
│  │  - user_id       │  │  - id                        │     │
│  │  - run_policy    │  │  - user_id                   │     │
│  │  - sample_rate   │  │  - interaction_id            │     │
│  │  - max_eval_day  │  │  - prompt                    │     │
│  │  - obfuscate_pii │  │  - response                  │     │
│  └──────────────────┘  │  - score                     │     │
│                        │  - latency_ms                │     │
│                        │  - flags (array)             │     │
│                        │  - pii_tokens_redacted       │     │
│                        │  - created_at                │     │
│                        └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Data Flow

1. **User Signs Up/Logs In** → Supabase Authentication
2. **User Configures Settings** → Saved to `eval_settings` table
3. **AI System Sends Evaluation** → POST to `/api/evals/ingest`
4. **API Validates & Processes** → Applies policies, redacts PII
5. **Data Stored** → Saved to `evals` table
6. **Dashboard Displays** → Real-time KPIs and charts

---

## Application Components

### 1. Landing Page (`/`)
- **Purpose**: Welcome page for unauthenticated users
- **Features**: 
  - Hero section with app description
  - Feature highlights
  - Call-to-action buttons (Login/Sign Up)

### 2. Authentication (`/auth/login`, `/auth/sign-up`)
- **Purpose**: User registration and login
- **Features**:
  - Email/password authentication via Supabase
  - Email confirmation (optional)
  - Error handling and validation
  - Redirect to dashboard after login

### 3. Dashboard (`/dashboard`)
- **Purpose**: Main analytics and monitoring interface
- **Features**:
  - **KPI Cards**: 
    - Average Score (0-1 scale)
    - Average Latency (milliseconds)
    - Redaction Rate (% of PII redacted)
    - Success Rate (% of successful evaluations)
  - **Trend Charts**:
    - 7-day score trend
    - 30-day score trend
    - 7-day latency trend
    - 30-day latency trend
  - **Evaluations Table**:
    - Searchable list of all evaluations
    - Pagination (100 rows per page)
    - Filter by date range
    - View detailed evaluation information

### 4. Settings Page (`/settings`)
- **Purpose**: Configure evaluation policies
- **Features**:
  - **Run Policy**: Always collect or sample evaluations
  - **Sample Rate**: Percentage of evaluations to collect (0-100%)
  - **Daily Limit**: Maximum evaluations per day
  - **PII Obfuscation**: Toggle to redact sensitive data
  - Save and update settings

### 5. API Endpoint (`/api/evals/ingest`)
- **Purpose**: Receive evaluation data from AI systems
- **Method**: POST
- **Authentication**: Bearer token (Supabase JWT)
- **Request Body**:
  \`\`\`json
  {
    "interaction_id": "unique-id-123",
    "prompt": "What is the capital of France?",
    "response": "The capital of France is Paris.",
    "score": 0.95,
    "latency_ms": 250,
    "flags": ["correct", "helpful"],
    "pii_tokens_redacted": 0
  }
  \`\`\`
- **Response Codes**:
  - `201`: Evaluation saved successfully
  - `202`: Evaluation sampled (not saved due to policy)
  - `429`: Daily limit exceeded
  - `401`: Unauthorized
  - `400`: Invalid request
  - `500`: Server error

---

## How to Test with Real Data

### Step 1: Set Up the Database

1. Go to Supabase Dashboard → SQL Editor
2. Run `scripts/001_create_tables.sql`
3. Run `scripts/002_rls_policies.sql`

### Step 2: Create a Test User

1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Enter email: `test@example.com`
4. Enter password: `TestPassword123!`
5. Confirm email (if required)
6. Log in with the same credentials

### Step 3: Configure Settings

1. Go to `http://localhost:3000/settings`
2. Configure:
   - **Run Policy**: Select "Always" (to collect all evaluations)
   - **Sample Rate**: Set to 100% (collect all)
   - **Daily Limit**: Set to 1000 (high limit for testing)
   - **PII Obfuscation**: Toggle ON (to test redaction)
3. Click "Save Settings"

### Step 4: Send Test Evaluations

Use curl or Postman to send evaluation data:

\`\`\`bash
# Get your auth token first (from browser console or Supabase)
# Then send evaluations:

curl -X POST http://localhost:3000/api/evals/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "interaction_id": "eval-001",
    "prompt": "What is 2+2?",
    "response": "The answer is 4",
    "score": 0.95,
    "latency_ms": 150,
    "flags": ["correct", "helpful"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

### Step 5: Send Multiple Evaluations

Send 10-20 evaluations with varying scores and latencies:

\`\`\`bash
# Script to send multiple evaluations
for i in {1..20}; do
  SCORE=$(echo "scale=2; $RANDOM / 32767" | bc)
  LATENCY=$((RANDOM % 500 + 50))
  
  curl -X POST http://localhost:3000/api/evals/ingest \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d "{
      \"interaction_id\": \"eval-$i\",
      \"prompt\": \"Test prompt $i\",
      \"response\": \"Test response $i\",
      \"score\": $SCORE,
      \"latency_ms\": $LATENCY,
      \"flags\": [\"test\"],
      \"pii_tokens_redacted\": 0
    }"
  
  sleep 1
done
\`\`\`

### Step 6: View Results on Dashboard

1. Go to `http://localhost:3000/dashboard`
2. You should see:
   - **KPI Cards** updated with real data
   - **Trend Charts** showing score and latency trends
   - **Evaluations Table** populated with your test data
3. Click on any evaluation to see detailed information

---

## Understanding the Data

### Evaluation Score (0-1 scale)
- **1.0**: Perfect response
- **0.8-0.9**: Good response
- **0.6-0.7**: Acceptable response
- **0.4-0.5**: Poor response
- **0.0-0.3**: Very poor response

### Latency (milliseconds)
- **< 100ms**: Excellent
- **100-300ms**: Good
- **300-500ms**: Acceptable
- **> 500ms**: Slow

### Flags
Custom tags to categorize evaluations:
- `correct`: Response is factually correct
- `helpful`: Response is helpful to user
- `complete`: Response is complete
- `error`: Response contains an error
- `timeout`: Response took too long
- `hallucination`: Response contains made-up information

### PII Tokens Redacted
Number of personally identifiable information tokens that were redacted:
- `0`: No PII found
- `> 0`: PII was detected and redacted

---

## Real-World Example Scenario

### Scenario: Monitoring a Customer Support AI Agent

**Setup:**
- AI agent answers customer support questions
- Want to track quality and performance
- Need to ensure PII (customer names, emails) is redacted

**Configuration:**
- Run Policy: Always (collect all interactions)
- Sample Rate: 100%
- Daily Limit: 10,000
- PII Obfuscation: ON

**Data Flow:**
1. Customer asks: "Hi, my name is John Smith and my email is john@example.com. Can you help me reset my password?"
2. AI Agent responds: "I'll help you reset your password. Please check your email for instructions."
3. System sends evaluation:
   \`\`\`json
   {
     "interaction_id": "support-12345",
     "prompt": "Hi, my name is [REDACTED] and my email is [REDACTED]. Can you help me reset my password?",
     "response": "I'll help you reset your password. Please check your email for instructions.",
     "score": 0.92,
     "latency_ms": 245,
     "flags": ["helpful", "complete"],
     "pii_tokens_redacted": 2
   }
   \`\`\`
4. Dashboard shows:
   - Average score: 0.92
   - Average latency: 245ms
   - Redaction rate: 100% (all PII redacted)
   - Success rate: 100%

---

## Key Features Explained

### 1. Sampling Policy
**Why?** To reduce costs by not storing every evaluation
**How?** 
- Set sample rate to 50% → Only 50% of evaluations are stored
- Remaining 50% are counted but not stored
- API returns 202 (Accepted but not stored)

### 2. Daily Limits
**Why?** To prevent accidental data overload
**How?**
- Set daily limit to 1000
- After 1000 evaluations, API returns 429 (Too Many Requests)
- Resets at midnight UTC

### 3. PII Obfuscation
**Why?** To protect customer privacy
**How?**
- When enabled, system redacts sensitive data
- Counts number of tokens redacted
- Helps with compliance (GDPR, CCPA, etc.)

### 4. Row Level Security (RLS)
**Why?** To ensure users only see their own data
**How?**
- Each user can only see their own evaluations
- Database enforces this at the row level
- No user can access another user's data

---

## Performance Optimization

### For Large Datasets (20,000+ rows)

1. **Indexes**: Database has indexes on:
   - `user_id` (fast user filtering)
   - `created_at` (fast date range queries)
   - `score` (fast score filtering)

2. **Pagination**: Dashboard shows 100 rows per page
   - Reduces load time
   - Improves user experience

3. **Caching**: Consider adding Redis for:
   - KPI calculations
   - Trend data
   - Frequently accessed queries

---

## Troubleshooting

### Issue: "Email not confirmed"
**Solution**: Disable email confirmation in Supabase Settings → Authentication → Email

### Issue: "Error fetching data: {}"
**Solution**: Run the SQL migration scripts in Supabase SQL Editor

### Issue: "Unauthorized" when calling API
**Solution**: Make sure you're sending a valid JWT token in the Authorization header

### Issue: "Daily limit exceeded"
**Solution**: Increase the daily limit in Settings or wait until midnight UTC

---

## Next Steps

1. **Test with real data** using the curl commands above
2. **Monitor the dashboard** to see trends
3. **Adjust settings** based on your needs
4. **Deploy to production** using Vercel
5. **Integrate with your AI system** using the API endpoint

---

## API Integration Example (Python)

\`\`\`python
import requests
import json
from datetime import datetime

# Your Supabase JWT token
AUTH_TOKEN = "your_jwt_token_here"

# API endpoint
API_URL = "http://localhost:3000/api/evals/ingest"

# Headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

# Send evaluation
evaluation = {
    "interaction_id": f"eval-{datetime.now().timestamp()}",
    "prompt": "What is machine learning?",
    "response": "Machine learning is a subset of AI that enables systems to learn from data.",
    "score": 0.88,
    "latency_ms": 320,
    "flags": ["correct", "helpful"],
    "pii_tokens_redacted": 0
}

response = requests.post(API_URL, json=evaluation, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
\`\`\`

---

## Summary

The **AI Agent Evaluation Dashboard** is a complete solution for:
- Monitoring AI agent performance
- Tracking quality metrics
- Ensuring data privacy
- Analyzing trends
- Optimizing costs

Use it to gain insights into your AI systems and make data-driven decisions!
