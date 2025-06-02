import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import { initializeClientSchema, initializeClientData } from "./init-client-schema";

let app: express.Application | null = null;

// Initialize client schema on startup
const initializeApp = async () => {
  const clientName = process.env.CLIENT_NAME;
  const domain = process.env.VERCEL_URL || process.env.DOMAIN;
  
  if (clientName && process.env.DATABASE_URL && process.env.DATABASE_URL !== "postgresql://placeholder") {
    try {
      log(`Initializing schema for client: ${clientName}`);
      await initializeClientSchema(clientName);
      
      if (domain) {
        await initializeClientData(clientName, domain);
      }
      log(`Client initialization completed for: ${clientName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Failed to initialize client ${clientName}: ${errorMessage}`);
      // Continue with server startup even if initialization fails
    }
  } else {
    log(`Skipping client initialization - missing CLIENT_NAME or DATABASE_URL`);
  }
};

async function getApp() {
  if (app) return app;
  
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  // Initialize client schema before setting up routes
  await initializeApp();
  
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // In production, serve static files
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  return app;
}

// For development
if (process.env.NODE_ENV !== "production") {
  (async () => {
    const { setupVite } = await import("./vite");
    const { createServer } = await import("http");
    
    const expressApp = await getApp();
    const server = createServer(expressApp);
    
    await setupVite(expressApp, server);
    
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
}

// For Vercel serverless
export default async function handler(req: Request, res: Response) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
