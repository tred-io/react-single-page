import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeClientSchema, initializeClientData } from "./init-client-schema";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

(async () => {
  // Initialize client schema before starting server
  await initializeApp();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
