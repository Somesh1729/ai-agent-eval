import { db } from "../db/index.js";
import { users, evals, evalSettings } from "../shared/schema.js";
import { faker } from "@faker-js/faker";

const FLAGS_OPTIONS = ["success", "warning", "error", "timeout", "rate_limit", "validation_error"];

async function seed() {
  console.log("Starting seed...");

  // Create a test user
  const [user] = await db.insert(users).values({
    email: "demo@example.com",
  }).returning();

  console.log(`Created user: ${user.email}`);

  // Create settings for the user
  await db.insert(evalSettings).values({
    userId: user.id,
    runPolicy: "always",
    sampleRatePct: 100,
    obfuscatePii: true,
    maxEvalPerDay: 10000,
  });

  console.log("Created settings");

  // Generate 500-1000 random evaluations
  const numEvals = faker.number.int({ min: 500, max: 1000 });
  console.log(`Generating ${numEvals} evaluations...`);

  const evaluations: typeof evals.$inferInsert[] = [];
  const now = new Date();

  for (let i = 0; i < numEvals; i++) {
    // Random date within last 60 days
    const daysAgo = faker.number.int({ min: 0, max: 60 });
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    // Generate random flags (0-3 flags per eval)
    const numFlags = faker.number.int({ min: 0, max: 3 });
    const flags = Array.from({ length: numFlags }, () => 
      faker.helpers.arrayElement(FLAGS_OPTIONS)
    );

    evaluations.push({
      userId: user.id,
      interactionId: faker.string.uuid(),
      prompt: faker.lorem.paragraph({ min: 1, max: 3 }),
      response: faker.lorem.paragraphs({ min: 1, max: 5 }),
      score: faker.number.float({ min: 0.3, max: 1.0, fractionDigits: 3 }),
      latencyMs: faker.number.int({ min: 50, max: 5000 }),
      flags,
      piiTokensRedacted: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 10 }) : 0,
      createdAt,
    });

    // Insert in batches of 100
    if (evaluations.length === 100 || i === numEvals - 1) {
      await db.insert(evals).values(evaluations);
      console.log(`Inserted ${i + 1}/${numEvals} evaluations`);
      evaluations.length = 0;
    }
  }

  console.log("Seed completed successfully!");
  console.log(`\nLogin credentials:`);
  console.log(`Email: demo@example.com`);
  console.log(`Password: (any password will work for demo)`);
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
