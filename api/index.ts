import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the Express app
let initialized = false;

async function initializeApp() {
  if (initialized) return app;
  
  try {
    await registerRoutes(app);
    
    // In production, serve static files
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    }
    
    initialized = true;
    return app;
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  try {
    const app = await initializeApp();
    app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}