import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, timestamp, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Evaluation settings table
export const evalSettings = pgTable("eval_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  runPolicy: text("run_policy").notNull().default("always"), // 'always' or 'sampled'
  sampleRatePct: integer("sample_rate_pct").notNull().default(100), // 0-100
  obfuscatePii: boolean("obfuscate_pii").notNull().default(false),
  maxEvalPerDay: integer("max_eval_per_day").notNull().default(10000),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Evaluations table
export const evals = pgTable("evals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  interactionId: text("interaction_id").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  score: doublePrecision("score").notNull(), // 0-1
  latencyMs: integer("latency_ms").notNull(),
  flags: text("flags").array().notNull().default(sql`ARRAY[]::text[]`),
  piiTokensRedacted: integer("pii_tokens_redacted").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
});

export const insertEvalSettingsSchema = createInsertSchema(evalSettings).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEvalSchema = createInsertSchema(evals).omit({
  id: true,
  userId: true,
}).extend({
  createdAt: z.string().transform((val) => new Date(val)), // Accept ISO string
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EvalSettings = typeof evalSettings.$inferSelect;
export type InsertEvalSettings = z.infer<typeof insertEvalSettingsSchema>;

export type Eval = typeof evals.$inferSelect;
export type InsertEval = z.infer<typeof insertEvalSchema>;
