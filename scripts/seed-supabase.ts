import { createClient } from "@supabase/supabase-js"
import { faker } from "@faker-js/faker"

const FLAGS_OPTIONS = ["success", "warning", "error", "timeout", "rate_limit", "validation_error"]

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("Starting seed...")

  try {
    // Create a test user via auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "demo@example.com",
      password: "DemoPassword123!",
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating user:", authError)
      process.exit(1)
    }

    const userId = authData.user.id
    console.log(`Created user: demo@example.com (ID: ${userId})`)

    // Create settings for the user
    const { error: settingsError } = await supabase.from("eval_settings").insert({
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

    console.log("Created evaluation settings")

    // Generate 500-1000 random evaluations
    const numEvals = faker.number.int({ min: 500, max: 1000 })
    console.log(`Generating ${numEvals} evaluations...`)

    const evaluations: any[] = []
    const now = new Date()

    for (let i = 0; i < numEvals; i++) {
      // Random date within last 60 days
      const daysAgo = faker.number.int({ min: 0, max: 60 })
      const createdAt = new Date(now)
      createdAt.setDate(createdAt.getDate() - daysAgo)

      // Generate random flags (0-3 flags per eval)
      const numFlags = faker.number.int({ min: 0, max: 3 })
      const flags = Array.from({ length: numFlags }, () => faker.helpers.arrayElement(FLAGS_OPTIONS))

      evaluations.push({
        user_id: userId,
        interaction_id: faker.string.uuid(),
        prompt: faker.lorem.paragraph({ min: 1, max: 3 }),
        response: faker.lorem.paragraphs({ min: 1, max: 5 }),
        score: faker.number.float({ min: 0.3, max: 1.0, fractionDigits: 3 }),
        latency_ms: faker.number.int({ min: 50, max: 5000 }),
        flags,
        pii_tokens_redacted: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 10 }) : 0,
        created_at: createdAt.toISOString(),
      })

      // Insert in batches of 100
      if (evaluations.length === 100 || i === numEvals - 1) {
        const { error: insertError } = await supabase.from("evals").insert(evaluations)

        if (insertError) {
          console.error("Error inserting evaluations:", insertError)
          process.exit(1)
        }

        console.log(`Inserted ${i + 1}/${numEvals} evaluations`)
        evaluations.length = 0
      }
    }

    console.log("\nSeed completed successfully!")
    console.log(`\nLogin credentials:`)
    console.log(`Email: demo@example.com`)
    console.log(`Password: DemoPassword123!`)
    console.log(`\nYou can now log in to the dashboard and view the seeded data.`)

    process.exit(0)
  } catch (error) {
    console.error("Seed failed:", error)
    process.exit(1)
  }
}

seed()
