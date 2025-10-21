import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEvalSettingsSchema, insertEvalSchema } from "@shared/schema";
import { z } from "zod";

// Session user type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Middleware to check authentication
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).send("Email and password required");
      }

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).send("User already exists");
      }

      const user = await storage.createUser({ email, password });
      
      // Create default settings for new user
      await storage.createSettings({
        userId: user.id,
        runPolicy: "always",
        sampleRatePct: 100,
        obfuscatePii: false,
        maxEvalPerDay: 10000,
      });

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).send(error.message);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).send("Email and password required");
      }

      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).send("Invalid credentials");
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).send(error.message);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
      res.send("Logged out");
    });
  });

  // Settings routes
  app.get("/api/settings", requireAuth, async (req, res) => {
    try {
      let settings = await storage.getSettings(req.session.userId!);
      
      if (!settings) {
        settings = await storage.createSettings({
          userId: req.session.userId!,
          runPolicy: "always",
          sampleRatePct: 100,
          obfuscatePii: false,
          maxEvalPerDay: 10000,
        });
      }
      
      res.json(settings);
    } catch (error: any) {
      console.error("Get settings error:", error);
      res.status(500).send(error.message);
    }
  });

  app.put("/api/settings", requireAuth, async (req, res) => {
    try {
      const data = insertEvalSettingsSchema.parse(req.body);
      
      let settings = await storage.getSettings(req.session.userId!);
      
      if (!settings) {
        settings = await storage.createSettings({
          ...data,
          userId: req.session.userId!,
        });
      } else {
        settings = await storage.updateSettings(req.session.userId!, data);
      }
      
      res.json(settings);
    } catch (error: any) {
      console.error("Update settings error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send(error.message);
    }
  });

  // Evaluation ingestion endpoint (no auth required for external services)
  app.post("/api/evals/ingest", async (req, res) => {
    try {
      // For now, we'll use a header or default user for ingestion
      // In production, this would use API keys or service auth
      const userId = req.headers['x-user-id'] as string || req.session?.userId;
      
      if (!userId) {
        return res.status(401).send("User ID required");
      }

      const data = insertEvalSchema.parse(req.body);
      const evaluation = await storage.createEval({
        ...data,
        userId,
      });
      
      res.json(evaluation);
    } catch (error: any) {
      console.error("Ingest error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send(error.message);
    }
  });

  // Evaluations routes
  app.get("/api/evals", requireAuth, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const search = req.query.search as string;
      const flag = req.query.flag as string;

      const evaluations = await storage.getEvals(req.session.userId!, {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search,
        flag,
      });
      
      res.json(evaluations);
    } catch (error: any) {
      console.error("Get evals error:", error);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/evals/:id", requireAuth, async (req, res) => {
    try {
      const evaluation = await storage.getEvalById(req.params.id, req.session.userId!);
      
      if (!evaluation) {
        return res.status(404).send("Evaluation not found");
      }
      
      res.json(evaluation);
    } catch (error: any) {
      console.error("Get eval error:", error);
      res.status(500).send(error.message);
    }
  });

  // Stats routes
  app.get("/api/stats/dashboard", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.session.userId!);
      res.json(stats);
    } catch (error: any) {
      console.error("Get dashboard stats error:", error);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(req.session.userId!);
      res.json(analytics);
    } catch (error: any) {
      console.error("Get analytics error:", error);
      res.status(500).send(error.message);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
