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

  // CORS middleware
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    next();
  });

  // Initialize client schema
  await initializeApp();
  
  // API endpoints
  app.get('/api/store-settings', (req, res) => {
    const defaultSettings = {
      id: 1,
      storeName: "Brown Feed Store",
      tagline: "Your Agricultural Supply Partner Since 1967",
      address: "123 Main Street, Lampasas, TX 76550",
      phone: "(512) 556-3467",
      email: "info@brownfeedstore.com",
      mondayHours: "8:00 AM - 6:00 PM",
      tuesdayHours: "8:00 AM - 6:00 PM",
      wednesdayHours: "8:00 AM - 6:00 PM",
      thursdayHours: "8:00 AM - 6:00 PM",
      fridayHours: "8:00 AM - 6:00 PM",
      saturdayHours: "8:00 AM - 5:00 PM",
      sundayHours: "Closed",
      facebookUrl: "https://facebook.com/brownfeedstore",
      instagramUrl: "https://instagram.com/brownfeedstore",
      twitterUrl: "https://twitter.com/brownfeedstore",
      websiteUrl: "https://brownfeedstore.com",
      heroTitle: "Quality Feed & Farm Supplies",
      heroSubtitle: "Serving Central Texas farmers and ranchers for over 50 years",
      aboutTitle: "About Brown Feed Store",
      aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas. We provide high-quality livestock feed, pet supplies, and farm equipment with personalized service and expert advice.",
      aboutStory: "What started as a small family operation has grown into a cornerstone of the agricultural community. Our commitment to quality products and exceptional customer service has made us the go-to destination for farmers, ranchers, and pet owners across the region.",
      foundedYear: "1967",
      heroImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      aboutImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      primaryColor: "#8B4513",
      secondaryColor: "#D2691E", 
      accentColor: "#228B22",
      fontFamily: "Inter",
      seoTitle: "Brown Feed Store - Quality Feed & Farm Supplies | Lampasas, TX",
      seoDescription: "Family-owned feed store serving Central Texas since 1967. Quality livestock feed, pet supplies, and farm equipment with expert advice.",
      seoKeywords: "feed store, livestock feed, pet food, farm supplies, Lampasas Texas, Central Texas"
    };
    res.json(defaultSettings);
  });

  app.put('/api/store-settings', (req, res) => {
    res.json(req.body);
  });

  app.get('/api/product-categories', (req, res) => {
    const defaultCategories = [
      {
        id: 1,
        name: "Livestock Feed",
        description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
        imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Pet Food & Supplies",
        description: "Premium nutrition and supplies for dogs, cats, and small animals",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Farm Equipment & Tools",
        description: "Essential tools and equipment for farm operations",
        imageUrl: "https://images.unsplash.com/photo-1574263867128-73b8bdb2c7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        featured: true,
        sortOrder: 3
      }
    ];
    res.json(defaultCategories);
  });

  app.get('/api/special-services', (req, res) => {
    const defaultServices = [
      {
        id: 1,
        name: "Custom Feed Mixing",
        description: "Specialized feed blends tailored to your livestock's specific nutritional needs",
        icon: "Settings",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Feed Delivery",
        description: "Convenient delivery service for bulk orders throughout Lampasas County",
        icon: "Truck",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Expert Consultation",
        description: "Get personalized advice from our experienced team on nutrition and animal care",
        icon: "Users",
        featured: true,
        sortOrder: 3
      }
    ];
    res.json(defaultServices);
  });

  app.get('/api/featured-brands', (req, res) => {
    const defaultBrands = [
      {
        id: 1,
        name: "Purina",
        description: "Trusted leader in animal nutrition with scientifically formulated feeds",
        logoUrl: "https://www.purina.com/sites/default/files/2021-02/Purina-Logo_0.png",
        websiteUrl: "https://www.purina.com",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Nutrena",
        description: "Premium nutrition solutions for livestock and equine",
        logoUrl: "https://www.nutrenaworld.com/themes/custom/nutrena/images/nutrena-logo.png",
        websiteUrl: "https://www.nutrenaworld.com",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Producer's Pride",
        description: "Quality feed and supplies trusted by farmers nationwide",
        logoUrl: "https://www.tractorsupply.com/brand/producers-pride",
        websiteUrl: "https://www.tractorsupply.com",
        featured: true,
        sortOrder: 3
      }
    ];
    res.json(defaultBrands);
  });
  
  // Register additional API routes
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