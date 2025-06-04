import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { initializeClientSchema, initializeClientData } from "../server/init-client-schema";
import path from "path";
import fs from "fs";

let app: express.Application | null = null;
let initialized = false;

const log = (message: string, source = "vercel") => {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
};

// Initialize client schema on startup
const initializeApp = async () => {
  if (initialized) return;
  
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
    }
  } else {
    log(`Skipping client initialization - missing CLIENT_NAME or DATABASE_URL`);
  }
  
  initialized = true;
};

async function getApp() {
  if (app) return app;
  
  app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // Initialize client schema
  await initializeApp();
  
  // Register API routes
  await registerRoutes(app);

  // Serve static files from dist directory
  const distPath = path.resolve(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Catch-all handler for SPA
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build files not found');
      }
    });
  } else {
    // Fallback HTML if no build exists
    app.get('*', (req, res) => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${process.env.CLIENT_NAME || 'Brown Feed Store'} - Lampasas, TX</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>${process.env.CLIENT_NAME || 'Brown Feed Store'}</h1>
          <p>Located in Lampasas, Texas</p>
          <p>Build files not found. Please ensure the React app is built.</p>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error: ${message}`);
    res.status(status).json({ message });
  });

  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}