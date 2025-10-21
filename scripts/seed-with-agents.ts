import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
import { faker } from "@faker-js/faker"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

// AI Agent configurations
const AI_AGENTS = [
  {
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    type: "support",
    prompts: [
      "How do I reset my password?",
      "What are your business hours?",
      "Can I get a refund?",
      "How do I contact support?",
      "What payment methods do you accept?",
    ],
  },
  {
    name: "Content Generator",
    description: "Generates marketing content and copy",
    type: "content",
    prompts: [
      "Write a product description for a laptop",
      "Create a social media post about our new feature",
      "Write an email subject line for a promotion",
      "Generate a blog post title about AI",
      "Create ad copy for a mobile app",
    ],
  },
  {
    name: "Code Assistant",
    description: "Helps with coding and debugging",
    type: "coding",
    prompts: [
      "How do I fix a null pointer exception?",
      "Explain async/await in JavaScript",
      "What's the best way to handle errors?",
      "How do I optimize database queries?",
      "What are design patterns in software?",
    ],
  },
  {
    name: "Data Analyst",
    description: "Analyzes data and generates insights",
    type: "analytics",
    prompts: [
      "What's the trend in our sales data?",
      "How do I calculate ROI?",
      "What are the key metrics to track?",
      "How do I identify outliers in data?",
      "What's the correlation between these variables?",
    ],
  },
  {
    name: "HR Assistant",
    description: "Handles HR-related queries",
    type: "hr",
    prompts: [
      "What's the vacation policy?",
      "How do I request time off?",
      "What benefits are available?",
      "How do I update my profile?",
      "What's the dress code?",
    ],
  },
]

const FLAGS_OPTIONS = ["success", "warning", "error", "timeout", "rate_limit", "validation_error"]

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("Starting enhanced seed with AI agents...\n")

  try {
    // Create a test user via auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "demo@example.com",
      password: "DemoPassword123!",
      email_confirm: true,
    })

    if (authError && !authError.message.includes("already exists")) {
      console.error("Error creating user:", authError)
      process.exit(1)
    }

    const userId = authError?.message.includes("already exists")
      ? (await supabase.from("eval_settings").select("user_id").limit(1)).data?.[0]?.user_id
      : authData?.user.id

    console.log(`Using user ID: ${userId}`)

    // Create settings for the user
    const { error: settingsError } = await supabase.from("eval_settings").upsert({
      user_id: userId,
      run_policy: "always",
      sample_rate_pct: 100,
      obfuscate_pii: true,
      max_eval_per_day: 10000,
    })

    if (settingsError) {
      console.error("Error creating settings:", settingsError)
      process.exit(1)
    }

    console.log("✓ Created evaluation settings\n")

    // Generate evaluations for each AI agent
    let totalEvals = 0

    for (const agent of AI_AGENTS) {
      const numEvals = faker.number.int({ min: 80, max: 150 })
      console.log(`Generating ${numEvals} evaluations for "${agent.name}"...`)

      const evaluations: any[] = []
      const now = new Date()

      for (let i = 0; i < numEvals; i++) {
        // Random date within last 60 days
        const daysAgo = faker.number.int({ min: 0, max: 60 })
        const createdAt = new Date(now)
        createdAt.setDate(createdAt.getDate() - daysAgo)

        // Generate random flags (0-2 flags per eval)
        const numFlags = faker.number.int({ min: 0, max: 2 })
        const flags = Array.from({ length: numFlags }, () => faker.helpers.arrayElement(FLAGS_OPTIONS))

        // Higher success rate for better agents
        const baseScore = agent.type === "support" ? 0.85 : agent.type === "content" ? 0.82 : 0.8
        const score = Math.max(0.3, Math.min(1.0, baseScore + faker.number.float({ min: -0.2, max: 0.2 })))

        // Realistic latency based on agent type
        const baseLatency = agent.type === "coding" ? 2000 : agent.type === "analytics" ? 1500 : 800
        const latency = baseLatency + faker.number.int({ min: -300, max: 300 })

        evaluations.push({
          user_id: userId,
          interaction_id: `${agent.type}-${faker.string.uuid()}`,
          prompt: faker.helpers.arrayElement(agent.prompts),
          response: faker.lorem.paragraphs({ min: 2, max: 4 }),
          score: Number.parseFloat(score.toFixed(3)),
          latency_ms: Math.max(50, latency),
          flags,
          pii_tokens_redacted: faker.datatype.boolean({ probability: 0.3 }) ? faker.number.int({ min: 1, max: 5 }) : 0,
          created_at: createdAt.toISOString(),
        })

        // Insert in batches of 50
        if (evaluations.length === 50 || i === numEvals - 1) {
          const { error: insertError } = await supabase.from("evals").insert(evaluations)

          if (insertError) {
            console.error("Error inserting evaluations:", insertError)
            process.exit(1)
          }

          totalEvals += evaluations.length
          evaluations.length = 0
        }
      }

      console.log(`✓ Completed ${agent.name}\n`)
    }

    console.log("\n" + "=".repeat(50))
    console.log("SEED COMPLETED SUCCESSFULLY!")
    console.log("=".repeat(50))
    console.log(`\nTotal evaluations created: ${totalEvals}`)
    console.log(`AI Agents seeded: ${AI_AGENTS.length}`)
    console.log(`\nLogin credentials:`)
    console.log(`Email: demo@example.com`)
    console.log(`Password: DemoPassword123!`)
    console.log(`\nYou can now log in to the dashboard and view the seeded data.`)
    console.log("The dashboard will show metrics for all AI agents.\n")

    process.exit(0)
  } catch (error) {
    console.error("Seed failed:", error)
    process.exit(1)
  }
}

seed()
