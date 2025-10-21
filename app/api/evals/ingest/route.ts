import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface IngestPayload {
  interaction_id: string
  prompt: string
  response: string
  score: number
  latency_ms: number
  flags?: string[]
  pii_tokens_redacted?: number
  created_at?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const payload: IngestPayload = await request.json()

    // Validate required fields
    if (
      !payload.interaction_id ||
      !payload.prompt ||
      !payload.response ||
      payload.score === undefined ||
      !payload.latency_ms
    ) {
      return NextResponse.json(
        { error: "Missing required fields: interaction_id, prompt, response, score, latency_ms" },
        { status: 400 },
      )
    }

    // Validate score range
    if (payload.score < 0 || payload.score > 1) {
      return NextResponse.json({ error: "Score must be between 0 and 1" }, { status: 400 })
    }

    // Fetch user's evaluation settings
    const { data: settings, error: settingsError } = await supabase
      .from("eval_settings")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (settingsError && settingsError.code !== "PGRST116") {
      console.error("Error fetching settings:", settingsError)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }

    // Check if we should sample this evaluation
    if (settings && settings.run_policy === "sampled") {
      const random = Math.random() * 100
      if (random > settings.sample_rate_pct) {
        return NextResponse.json({ message: "Evaluation sampled out" }, { status: 202 })
      }
    }

    // Check daily limit
    if (settings) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count, error: countError } = await supabase
        .from("evals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())

      if (countError) {
        console.error("Error counting evals:", countError)
        return NextResponse.json({ error: "Failed to check daily limit" }, { status: 500 })
      }

      if (count && count >= settings.max_eval_per_day) {
        return NextResponse.json({ error: "Daily evaluation limit reached" }, { status: 429 })
      }
    }

    // Insert evaluation
    const { data, error: insertError } = await supabase.from("evals").insert({
      user_id: user.id,
      interaction_id: payload.interaction_id,
      prompt: payload.prompt,
      response: payload.response,
      score: payload.score,
      latency_ms: payload.latency_ms,
      flags: payload.flags || [],
      pii_tokens_redacted: payload.pii_tokens_redacted || 0,
      created_at: payload.created_at || new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting evaluation:", insertError)
      return NextResponse.json({ error: "Failed to save evaluation" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
