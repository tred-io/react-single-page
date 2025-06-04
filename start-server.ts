import express from "express";
import path from "path";
import { createServer } from "http";
import { storage } from "./server/storage";
import { insertStoreSettingsSchema, insertProductCategorySchema } from "./shared/schema";

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MIME type fix for JavaScript modules
app.use((req, res, next) => {
  if (req.url.endsWith('.js') || req.url.endsWith('.jsx') || req.url.endsWith('.ts') || req.url.endsWith('.tsx')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

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
        aboutTitle: "About Brown Feed Store",
        aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas.",
        aboutStory: "What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas.",
        foundedYear: "1967",
        primaryColor: "#8B4513",
        secondaryColor: "#D2691E",
        accentColor: "#228B22",
        fontFamily: "Inter, sans-serif",
        seoTitle: "Brown Feed Store - Agricultural Supply in Lampasas, TX",
        seoDescription: "Family-owned feed store serving Central Texas since 1967. Quality livestock feed, pet supplies, and farm equipment.",
        seoKeywords: "feed store, livestock feed, pet supplies, farm equipment, Lampasas Texas"
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

// Serve static files from client directory
app.use(express.static('client'));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

const server = createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});