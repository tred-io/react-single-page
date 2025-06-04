import express from "express";
import path from "path";
import { createServer } from "http";
import { storage } from "./server/storage";
import { insertStoreSettingsSchema, insertProductCategorySchema } from "./shared/schema";

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.static('client'));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Store settings endpoints
app.get("/api/store-settings", async (req, res) => {
  try {
    const settings = await storage.getStoreSettings();
    if (!settings) {
      return res.json({
        id: 1,
        storeName: "Brown Feed Store",
        tagline: "Your Agricultural Supply Partner",
        address: "123 Main St, Lampasas, TX",
        phone: "(512) 555-0123",
        primaryColor: "#2563eb",
        secondaryColor: "#64748b", 
        accentColor: "#f59e0b",
        fontFamily: "Inter"
      });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching store settings:", error);
    res.status(500).json({ message: "Failed to fetch store settings" });
  }
});

app.put("/api/store-settings", async (req, res) => {
  try {
    const validatedData = insertStoreSettingsSchema.parse(req.body);
    const updatedSettings = await storage.updateStoreSettings(validatedData);
    res.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error("Error updating store settings:", error);
    res.status(500).json({ message: "Failed to update store settings" });
  }
});

// Product categories endpoints
app.get("/api/product-categories", async (req, res) => {
  try {
    const categories = await storage.getProductCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    res.status(500).json({ message: "Failed to fetch product categories" });
  }
});

app.post("/api/product-categories", async (req, res) => {
  try {
    const validatedData = insertProductCategorySchema.parse(req.body);
    const newCategory = await storage.createProductCategory(validatedData);
    res.json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating product category:", error);
    res.status(500).json({ message: "Failed to create product category" });
  }
});

// Special services endpoints
app.get("/api/special-services", async (req, res) => {
  try {
    const services = await storage.getSpecialServices();
    res.json(services);
  } catch (error) {
    console.error("Error fetching special services:", error);
    res.status(500).json({ message: "Failed to fetch special services" });
  }
});

// Featured brands endpoints  
app.get("/api/featured-brands", async (req, res) => {
  try {
    const brands = await storage.getFeaturedBrands();
    res.json(brands);
  } catch (error) {
    console.error("Error fetching featured brands:", error);
    res.status(500).json({ message: "Failed to fetch featured brands" });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const server = createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});