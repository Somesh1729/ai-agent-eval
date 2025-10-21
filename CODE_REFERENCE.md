# Code Reference Guide

## Environment Variables

Create `.env.local`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Key Code Snippets

### 1. Supabase Client (Browser)
\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

### 2. Supabase Client (Server)
\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
\`\`\`

### 3. API Endpoint - Ingest Evaluations
\`\`\`typescript
// app/api/evals/ingest/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request
    const body = await request.json()
    
    // Validate
    if (!body.interaction_id || body.score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user settings
    const { data: settings } = await supabase
      .from('eval_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Check sampling
    if (settings?.run_policy === 'sampled') {
      const random = Math.random() * 100
      if (random > settings.sample_rate_pct) {
        return NextResponse.json({ message: 'Sampled out' }, { status: 202 })
      }
    }

    // Insert evaluation
    const { error } = await supabase
      .from('evals')
      .insert({
        user_id: user.id,
        interaction_id: body.interaction_id,
        prompt: body.prompt,
        response: body.response,
        score: body.score,
        latency_ms: body.latency_ms,
        flags: body.flags || [],
        pii_tokens_redacted: body.pii_tokens_redacted || 0,
      })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

### 4. Dashboard - Fetch KPIs
\`\`\`typescript
// Example: Fetching KPIs in dashboard
const { data: evals } = await supabase
  .from('evals')
  .select('score, latency_ms, pii_tokens_redacted')
  .eq('user_id', user.id)
  .gte('created_at', sevenDaysAgo)

const avgScore = evals?.reduce((sum, e) => sum + e.score, 0) / evals?.length
const avgLatency = evals?.reduce((sum, e) => sum + e.latency_ms, 0) / evals?.length
const redactionRate = evals?.filter(e => e.pii_tokens_redacted > 0).length / evals?.length
\`\`\`

### 5. Authentication - Sign Up
\`\`\`typescript
// Example: Sign up flow
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: window.location.origin,
  },
})

if (error) {
  // Handle error
} else {
  // Redirect to success page
}
\`\`\`

### 6. Authentication - Login
\`\`\`typescript
// Example: Login flow
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) {
  // Handle error
} else {
  // Redirect to dashboard
}
\`\`\`

## Database Queries

### Get User Settings
\`\`\`sql
SELECT * FROM eval_settings WHERE user_id = $1;
\`\`\`

### Get Recent Evaluations
\`\`\`sql
SELECT * FROM evals 
WHERE user_id = $1 
AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 100;
\`\`\`

### Calculate Average Score
\`\`\`sql
SELECT AVG(score) as avg_score 
FROM evals 
WHERE user_id = $1 
AND created_at >= NOW() - INTERVAL '7 days';
\`\`\`

### Count Daily Evaluations
\`\`\`sql
SELECT COUNT(*) as count 
FROM evals 
WHERE user_id = $1 
AND DATE(created_at) = CURRENT_DATE;
\`\`\`

## Common Tasks

### Create User Settings
\`\`\`typescript
const { error } = await supabase
  .from('eval_settings')
  .insert({
    user_id: user.id,
    run_policy: 'always',
    sample_rate_pct: 100,
    obfuscate_pii: false,
    max_eval_per_day: 10000,
  })
\`\`\`

### Update User Settings
\`\`\`typescript
const { error } = await supabase
  .from('eval_settings')
  .update({
    run_policy: 'sampled',
    sample_rate_pct: 50,
  })
  .eq('user_id', user.id)
\`\`\`

### Delete Old Evaluations
\`\`\`typescript
const { error } = await supabase
  .from('evals')
  .delete()
  .eq('user_id', user.id)
  .lt('created_at', thirtyDaysAgo)
