import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

let app: express.Application | null = null;

async function getApp() {
  if (app) return app;
  
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  try {
    await registerRoutes(app);
    
    // In production, serve static files
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    }
    
    return app;
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return new Promise((resolve, reject) => {
      expressApp(req as any, res as any, (err: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}