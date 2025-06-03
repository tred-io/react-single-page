import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for client sites
app.use(cors({
  origin: [
    'http://localhost:5000',
    'https://brown-feed-store-*.vercel.app',
    /https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Register API routes
registerRoutes(app);

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
