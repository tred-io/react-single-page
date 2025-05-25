import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStoreSettingsSchema, insertProductCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
