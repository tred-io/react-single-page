import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStoreSettingsSchema, insertProductCategorySchema } from "@shared/schema";
import { healthCheckHandler, quickHealthCheck } from "./health";
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
      res.json(settings);
    } catch (error) {
      console.error("Error fetching store settings:", error);
      res.status(500).json({ message: "Error fetching store settings" });
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
      res.json(categories);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      res.status(500).json({ message: "Error fetching product categories" });
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

  const httpServer = createServer(app);
  return httpServer;
}
