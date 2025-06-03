import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStoreSettingsSchema, insertProductCategorySchema } from "@shared/schema";
import { healthCheckHandler, quickHealthCheck } from "./health";
import { generateThemes, applyThemeToStoreSettings } from "./theme-generator";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Database error handling middleware
const handleDatabaseError = (error: any, req: any, res: any, next: any) => {
  if (error.message?.includes('database') || error.message?.includes('connection')) {
    return res.status(503).json({ 
      message: "Database connection unavailable", 
      error: "Service temporarily unavailable"
    });
  }
  if (error.message?.includes('CLIENT_NAME')) {
    return res.status(500).json({ 
      message: "Client configuration error", 
      error: "Site configuration incomplete"
    });
  }
  return res.status(500).json({ 
    message: "Internal server error", 
    error: error.message 
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoints (must be first to avoid conflicts)
  app.get("/api/health", healthCheckHandler);
  app.get("/api/health/quick", quickHealthCheck);
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadDir));
  
  // File upload endpoint
  app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, url: fileUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // Ensure API routes are registered before any other middleware
  // Store settings endpoints
  app.get("/api/store-settings", async (req, res) => {
    try {
      const settings = await storage.getStoreSettings();
      if (!settings) {
        // Return basic fallback when no settings exist yet
        return res.json({
          id: 1,
          storeName: "Loading...",
          tagline: "Website initializing...",
          address: "",
          phone: "",
          primaryColor: "#2563eb",
          secondaryColor: "#64748b",
          accentColor: "#f59e0b",
          fontFamily: "Inter"
        });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error fetching store settings:", error);
      handleDatabaseError(error, req, res, () => {});
    }
  });

  app.put("/api/store-settings", async (req, res) => {
    try {
      const validatedData = insertStoreSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateStoreSettings(validatedData);
      res.json({ success: true, data: updatedSettings });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Please fill in all required fields correctly.",
          errors: error.errors 
        });
      }
      console.error("Store settings update error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error updating store settings" 
      });
    }
  });

  // Product categories endpoints
  app.get("/api/product-categories", async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories || []);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      handleDatabaseError(error, req, res, () => {});
    }
  });

  app.put("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductCategorySchema.parse(req.body);
      const updatedCategory = await storage.updateProductCategory(id, validatedData);
      res.json({ success: true, data: updatedCategory });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Please fill in all required fields correctly.",
          errors: error.errors 
        });
      }
      console.error("Product category update error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error updating product category" 
      });
    }
  });

  app.post("/api/product-categories", async (req, res) => {
    try {
      console.log("Received category data:", req.body);
      const validatedData = insertProductCategorySchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const newCategory = await storage.createProductCategory(validatedData);
      console.log("Created category:", newCategory);
      res.json({ success: true, data: newCategory });
    } catch (error) {
      console.error("Product category creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          success: false, 
          message: "Please fill in all required fields correctly.",
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "Error creating product category",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/product-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProductCategory(id);
      if (deleted) {
        res.json({ success: true, message: "Product category deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Product category not found" });
      }
    } catch (error) {
      console.error("Product category deletion error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error deleting product category" 
      });
    }
  });

  // Special Services routes
  app.get("/api/special-services", async (req, res) => {
    try {
      const services = await storage.getSpecialServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching special services:", error);
      res.status(500).json({ message: "Failed to fetch special services" });
    }
  });

  app.post("/api/special-services", async (req, res) => {
    try {
      const service = await storage.createSpecialService(req.body);
      res.json({ success: true, data: service });
    } catch (error) {
      console.error("Error creating special service:", error);
      res.status(500).json({ message: "Failed to create special service" });
    }
  });

  app.put("/api/special-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateSpecialService(id, req.body);
      res.json({ success: true, data: service });
    } catch (error) {
      console.error("Error updating special service:", error);
      res.status(500).json({ message: "Failed to update special service" });
    }
  });

  app.delete("/api/special-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSpecialService(id);
      
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting special service:", error);
      res.status(500).json({ message: "Failed to delete special service" });
    }
  });

  // Featured Brands routes
  app.get("/api/featured-brands", async (req, res) => {
    try {
      const brands = await storage.getFeaturedBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching featured brands:", error);
      res.status(500).json({ message: "Failed to fetch featured brands" });
    }
  });

  app.post("/api/featured-brands", async (req, res) => {
    try {
      const brand = await storage.createFeaturedBrand(req.body);
      res.json({ success: true, data: brand });
    } catch (error) {
      console.error("Error creating featured brand:", error);
      res.status(500).json({ message: "Failed to create featured brand" });
    }
  });

  app.put("/api/featured-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await storage.updateFeaturedBrand(id, req.body);
      res.json({ success: true, data: brand });
    } catch (error) {
      console.error("Error updating featured brand:", error);
      res.status(500).json({ message: "Failed to update featured brand" });
    }
  });

  app.delete("/api/featured-brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFeaturedBrand(id);
      
      if (!success) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting featured brand:", error);
      res.status(500).json({ message: "Failed to delete featured brand" });
    }
  });

  // Theme generation endpoint
  app.post('/api/generate-themes', async (req, res) => {
    try {
      const { businessDescription } = req.body;
      
      if (!businessDescription || typeof businessDescription !== 'string') {
        return res.status(400).json({ message: "Business description is required" });
      }

      try {
        const themes = await generateThemes(businessDescription);
        res.json(themes);
      } catch (error: any) {
        if (error.status === 429 || error.code === 'insufficient_quota') {
          // Return demo themes when API quota is exceeded
          const demoThemes = {
            businessAnalysis: "This appears to be a rural veterinary clinic with a traditional, trustworthy atmosphere that serves both farm animals and family pets. The 25-year history suggests established community relationships and reliability.",
            themes: [
              {
                id: "theme-1",
                name: "Trusted Countryside",
                description: "Warm, traditional colors that reflect rural heritage and trustworthiness",
                primaryColor: "200 15% 35%",
                secondaryColor: "120 25% 85%", 
                accentColor: "35 60% 55%",
                fontFamily: "Merriweather",
                style: "traditional",
                mood: "Trustworthy and established",
                reasoning: "Earth tones and traditional serif fonts convey reliability and experience, perfect for a long-established rural practice"
              },
              {
                id: "theme-2", 
                name: "Modern Care",
                description: "Clean, professional design emphasizing medical expertise",
                primaryColor: "210 30% 25%",
                secondaryColor: "210 15% 90%",
                accentColor: "160 50% 45%",
                fontFamily: "Inter",
                style: "professional",
                mood: "Modern and capable",
                reasoning: "Clean blues and modern typography reflect medical professionalism while remaining approachable for rural clients"
              },
              {
                id: "theme-3",
                name: "Gentle Touch",
                description: "Soft, caring colors that emphasize compassion for animals",
                primaryColor: "25 20% 30%",
                secondaryColor: "45 35% 88%",
                accentColor: "90 40% 50%",
                fontFamily: "Poppins",
                style: "friendly", 
                mood: "Caring and approachable",
                reasoning: "Warm browns and gentle greens create a nurturing atmosphere that appeals to pet owners while staying professional"
              }
            ]
          };
          res.json(demoThemes);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error generating themes:", error);
      res.status(500).json({ message: "Failed to generate themes" });
    }
  });

  // Apply selected theme to store settings
  app.post('/api/apply-theme', async (req, res) => {
    try {
      const { themeId, themes, heroImage } = req.body;
      
      if (!themeId || !themes) {
        return res.status(400).json({ message: "Theme ID and themes are required" });
      }

      const selectedTheme = themes.find((t: any) => t.id === themeId);
      if (!selectedTheme) {
        return res.status(400).json({ message: "Theme not found" });
      }

      const currentSettings = await storage.getStoreSettings();
      if (!currentSettings) {
        return res.status(404).json({ message: "Store settings not found" });
      }

      const updatedSettings = applyThemeToStoreSettings(selectedTheme, currentSettings);
      
      // Update hero image if provided
      if (heroImage) {
        updatedSettings.heroImageUrl = heroImage;
      }
      
      const result = await storage.updateStoreSettings(updatedSettings);
      
      res.json(result);
    } catch (error) {
      console.error("Error applying theme:", error);
      res.status(500).json({ message: "Failed to apply theme" });
    }
  });

  // Stock photos API endpoint
  app.get('/api/stock-photos/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const accessKey = process.env.UNSPLASH_ACCESS_KEY;
      
      if (!accessKey) {
        return res.status(500).json({ message: "Unsplash API key not configured" });
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${accessKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Unsplash API request failed');
      }

      const data = await response.json();
      
      res.json({
        photos: data.results.map((photo: any) => ({
          id: photo.id,
          urls: {
            small: photo.urls.small,
            regular: photo.urls.regular,
            full: photo.urls.full
          },
          alt_description: photo.alt_description,
          description: photo.description,
          user: {
            name: photo.user.name,
            username: photo.user.username
          }
        }))
      });
    } catch (error) {
      console.error("Error fetching stock photos:", error);
      res.status(500).json({ message: "Failed to fetch stock photos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
