import { db } from "../db/index.js";
import { users, evalSettings, evals } from "../shared/schema.js";
import type { User, InsertUser, EvalSettings, InsertEvalSettings, Eval, InsertEval } from "@shared/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { password: string }): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  
  // Settings methods
  getSettings(userId: string): Promise<EvalSettings | undefined>;
  createSettings(settings: InsertEvalSettings & { userId: string }): Promise<EvalSettings>;
  updateSettings(userId: string, settings: InsertEvalSettings): Promise<EvalSettings>;
  
  // Evaluations methods
  getEvals(userId: string, options?: { limit?: number; offset?: number; search?: string; flag?: string }): Promise<Eval[]>;
  createEval(evaluation: InsertEval & { userId: string }): Promise<Eval>;
  getEvalById(id: string, userId: string): Promise<Eval | undefined>;
  
  // Stats methods
  getDashboardStats(userId: string): Promise<{
    avgScore: number;
    avgLatency: number;
    redactionRate: number;
    successRate: number;
    scoresTrend: Array<{ date: string; value: number }>;
    latencyTrend: Array<{ date: string; value: number }>;
  }>;
  
  getAnalytics(userId: string): Promise<{
    scoresTrend7d: Array<{ date: string; value: number }>;
    scoresTrend30d: Array<{ date: string; value: number }>;
    latencyTrend7d: Array<{ date: string; value: number }>;
    latencyTrend30d: Array<{ date: string; value: number }>;
    flagsDistribution: Array<{ name: string; count: number }>;
  }>;
}

export class DBStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await db.insert(users).values({
      email: user.email,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    return user;
  }

  async getSettings(userId: string): Promise<EvalSettings | undefined> {
    const result = await db.select().from(evalSettings).where(eq(evalSettings.userId, userId)).limit(1);
    return result[0];
  }

  async createSettings(settings: InsertEvalSettings & { userId: string }): Promise<EvalSettings> {
    const result = await db.insert(evalSettings).values(settings).returning();
    return result[0];
  }

  async updateSettings(userId: string, settings: InsertEvalSettings): Promise<EvalSettings> {
    const result = await db.update(evalSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(evalSettings.userId, userId))
      .returning();
    return result[0];
  }

  async getEvals(userId: string, options?: { limit?: number; offset?: number; search?: string; flag?: string }): Promise<Eval[]> {
    const { limit = 20, offset = 0, search, flag } = options || {};
    
    const conditions = [eq(evals.userId, userId)];
    
    if (search) {
      conditions.push(sql`${evals.interactionId} ILIKE ${`%${search}%`}`);
    }
    
    if (flag && flag !== "all") {
      conditions.push(sql`${flag} = ANY(${evals.flags})`);
    }
    
    const result = await db.select()
      .from(evals)
      .where(and(...conditions))
      .orderBy(desc(evals.createdAt))
      .limit(limit)
      .offset(offset);
    
    return result;
  }

  async createEval(evaluation: InsertEval & { userId: string }): Promise<Eval> {
    const result = await db.insert(evals).values(evaluation).returning();
    return result[0];
  }

  async getEvalById(id: string, userId: string): Promise<Eval | undefined> {
    const result = await db.select().from(evals)
      .where(and(eq(evals.id, id), eq(evals.userId, userId)))
      .limit(1);
    return result[0];
  }

  async getDashboardStats(userId: string): Promise<{
    avgScore: number;
    avgLatency: number;
    redactionRate: number;
    successRate: number;
    scoresTrend: Array<{ date: string; value: number }>;
    latencyTrend: Array<{ date: string; value: number }>;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvals = await db.select().from(evals)
      .where(and(eq(evals.userId, userId), gte(evals.createdAt, thirtyDaysAgo)))
      .orderBy(desc(evals.createdAt));

    if (recentEvals.length === 0) {
      return {
        avgScore: 0,
        avgLatency: 0,
        redactionRate: 0,
        successRate: 0,
        scoresTrend: [],
        latencyTrend: [],
      };
    }

    const avgScore = recentEvals.reduce((sum, e) => sum + e.score, 0) / recentEvals.length;
    const avgLatency = recentEvals.reduce((sum, e) => sum + e.latencyMs, 0) / recentEvals.length;
    const redactionRate = recentEvals.filter(e => e.piiTokensRedacted > 0).length / recentEvals.length;
    const successRate = recentEvals.filter(e => e.score >= 0.7).length / recentEvals.length;

    const scoresByDate = new Map<string, number[]>();
    const latencyByDate = new Map<string, number[]>();

    recentEvals.forEach(e => {
      const date = e.createdAt.toISOString().split('T')[0];
      if (!scoresByDate.has(date)) {
        scoresByDate.set(date, []);
        latencyByDate.set(date, []);
      }
      scoresByDate.get(date)!.push(e.score);
      latencyByDate.get(date)!.push(e.latencyMs);
    });

    const scoresTrend = Array.from(scoresByDate.entries())
      .map(([date, scores]) => ({
        date,
        value: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const latencyTrend = Array.from(latencyByDate.entries())
      .map(([date, latencies]) => ({
        date,
        value: latencies.reduce((a, b) => a + b, 0) / latencies.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { avgScore, avgLatency, redactionRate, successRate, scoresTrend, latencyTrend };
  }

  async getAnalytics(userId: string): Promise<{
    scoresTrend7d: Array<{ date: string; value: number }>;
    scoresTrend30d: Array<{ date: string; value: number }>;
    latencyTrend7d: Array<{ date: string; value: number }>;
    latencyTrend30d: Array<{ date: string; value: number }>;
    flagsDistribution: Array<{ name: string; count: number }>;
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const evals7d = await db.select().from(evals)
      .where(and(eq(evals.userId, userId), gte(evals.createdAt, sevenDaysAgo)))
      .orderBy(desc(evals.createdAt));

    const evals30d = await db.select().from(evals)
      .where(and(eq(evals.userId, userId), gte(evals.createdAt, thirtyDaysAgo)))
      .orderBy(desc(evals.createdAt));

    const getTrend = (evalsList: Eval[]) => {
      const scoresByDate = new Map<string, number[]>();
      const latencyByDate = new Map<string, number[]>();

      evalsList.forEach(e => {
        const date = e.createdAt.toISOString().split('T')[0];
        if (!scoresByDate.has(date)) {
          scoresByDate.set(date, []);
          latencyByDate.set(date, []);
        }
        scoresByDate.get(date)!.push(e.score);
        latencyByDate.get(date)!.push(e.latencyMs);
      });

      const scoresTrend = Array.from(scoresByDate.entries())
        .map(([date, scores]) => ({
          date,
          value: scores.reduce((a, b) => a + b, 0) / scores.length,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const latencyTrend = Array.from(latencyByDate.entries())
        .map(([date, latencies]) => ({
          date,
          value: latencies.reduce((a, b) => a + b, 0) / latencies.length,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return { scoresTrend, latencyTrend };
    };

    const trend7d = getTrend(evals7d);
    const trend30d = getTrend(evals30d);

    const flagsMap = new Map<string, number>();
    evals30d.forEach(e => {
      e.flags.forEach(flag => {
        flagsMap.set(flag, (flagsMap.get(flag) || 0) + 1);
      });
    });

    const flagsDistribution = Array.from(flagsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      scoresTrend7d: trend7d.scoresTrend,
      scoresTrend30d: trend30d.scoresTrend,
      latencyTrend7d: trend7d.latencyTrend,
      latencyTrend30d: trend30d.latencyTrend,
      flagsDistribution,
    };
  }
}

export const storage = new DBStorage();
