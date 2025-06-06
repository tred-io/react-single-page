// Client: texas-garden-supply
// Domain: texasgardensupply.com

import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

let app: express.Application | null = null;

const log = (message: string, source = "vercel") => {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
};

async function getApp() {
  if (app) return app;
  
  app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // CORS middleware
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      client: process.env.CLIENT_NAME || 'unknown',
      timestamp: new Date().toISOString() 
    });
  });

  // Store settings endpoint - loads from client-config.json
  app.get('/api/store-settings', async (req, res) => {
    try {
      const configPath = path.resolve(process.cwd(), 'client-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.json(config);
      } else {
        const clientName = process.env.CLIENT_NAME || 'Local Store';
        const fallbackConfig = {
          storeName: clientName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          tagline: "Your trusted local business",
          address: "123 Main Street, Your City, State 12345",
          phone: "(555) 123-4567",
          email: "info@example.com",
          mondayHours: "9:00 AM - 6:00 PM",
          tuesdayHours: "9:00 AM - 6:00 PM", 
          wednesdayHours: "9:00 AM - 6:00 PM",
          thursdayHours: "9:00 AM - 6:00 PM",
          fridayHours: "9:00 AM - 6:00 PM",
          saturdayHours: "9:00 AM - 4:00 PM",
          sundayHours: "Closed",
          aboutTitle: "About Our Store",
          aboutDescription: "A trusted local business serving our community",
          aboutStory: "We are committed to providing quality products and excellent service.",
          foundedYear: new Date().getFullYear().toString(),
          primaryColor: "#2563eb",
          secondaryColor: "#64748b", 
          accentColor: "#f59e0b",
          fontFamily: "Inter",
          seoTitle: `${clientName} - Quality Products and Service`,
          seoDescription: "A trusted local business providing quality products and excellent service.",
          seoKeywords: "local business, quality service, trusted provider"
        };
        res.json(fallbackConfig);
      }
    } catch (error) {
      log(`Error loading store settings: ${error}`);
      res.status(500).json({ error: 'Failed to load store settings' });
    }
  });

  // Product categories endpoint
  app.get('/api/product-categories', (req, res) => {
    const categories = [
      { id: 1, name: "Livestock Feed", description: "Premium feed for cattle, horses, and poultry", imageUrl: "/images/livestock-feed.jpg", featured: true, sortOrder: 1 },
      { id: 2, name: "Pet Supplies", description: "Food and accessories for dogs, cats, and small animals", imageUrl: "/images/pet-supplies.jpg", featured: true, sortOrder: 2 },
      { id: 3, name: "Farm Equipment", description: "Tools and equipment for agricultural operations", imageUrl: "/images/farm-equipment.jpg", featured: true, sortOrder: 3 },
      { id: 4, name: "Seeds & Plants", description: "High-quality seeds and plants for your garden", imageUrl: "/images/seeds-plants.jpg", featured: false, sortOrder: 4 }
    ];
    res.json(categories);
  });

  // Special services endpoint
  app.get('/api/special-services', (req, res) => {
    const services = [
      { id: 1, name: "Custom Feed Mixing", description: "Personalized feed blends for your livestock", icon: "Settings", featured: true, sortOrder: 1 },
      { id: 2, name: "Delivery Service", description: "Free delivery on orders over $100", icon: "Truck", featured: true, sortOrder: 2 },
      { id: 3, name: "Nutritional Consulting", description: "Expert advice on animal nutrition", icon: "Users", featured: true, sortOrder: 3 }
    ];
    res.json(services);
  });

  // Featured brands endpoint
  app.get('/api/featured-brands', (req, res) => {
    const brands = [
      { id: 1, name: "Purina", description: "Premium animal nutrition", logoUrl: "/images/purina-logo.png", websiteUrl: "https://www.purina.com", featured: true, sortOrder: 1 },
      { id: 2, name: "Nutrena", description: "Quality feed solutions", logoUrl: "/images/nutrena-logo.png", websiteUrl: "https://www.nutrenaworld.com", featured: true, sortOrder: 2 },
      { id: 3, name: "Big Tine", description: "Wildlife nutrition specialists", logoUrl: "/images/bigtine-logo.png", websiteUrl: "https://www.bigtine.com", featured: true, sortOrder: 3 }
    ];
    res.json(brands);
  });

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    log(`Express error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Serve static files from dist/public directory
  const distPath = path.resolve(process.cwd(), "dist/public");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // SPA fallback for frontend routes
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build files not found');
      }
    });
  } else {
    // Development fallback
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      const clientName = process.env.CLIENT_NAME || 'Client Site';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${clientName} - Coming Soon</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { color: #333; }
            p { color: #666; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${clientName}</h1>
            <p>Our website is being built and will be available soon.</p>
            <p>Thank you for your patience!</p>
          </div>
        </body>
        </html>
      `;
      res.send(html);
    });
  }

  return app;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (error) {
    log(`Handler error: ${error}`);
    res.status(500).json({ error: 'Server initialization failed' });
  }
}