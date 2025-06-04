import express from "express";
import path from "path";
import { registerRoutes } from "./server/routes";
import { setupVite, serveStatic, log } from "./server/vite";

async function startServer() {
  const app = express();
  
  // Basic middleware
  app.use(express.json());

  // Register API routes first
  const server = await registerRoutes(app);

  // Setup Vite development server or static serving
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(console.error);