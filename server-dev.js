const express = require('express');
const { createServer } = require('vite');
const path = require('path');

async function startDevServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: path.resolve(__dirname, 'client'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'client', 'src'),
        '@shared': path.resolve(__dirname, 'shared'),
      },
    },
  });
  
  // Express middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Store settings endpoint with Brown Feed Store data
  app.get('/api/store-settings', (req, res) => {
    res.json({
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
  });
  
  // Product categories endpoint
  app.get('/api/product-categories', (req, res) => {
    res.json([
      {
        id: 1,
        name: "Livestock Feed",
        description: "Premium quality feed for cattle, horses, pigs, goats, and sheep. Custom mixes available.",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Pet Supplies",
        description: "Complete line of pet food, treats, toys, and care products for dogs, cats, and small animals.",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Farm Equipment",
        description: "Essential tools and equipment for farming, ranching, and property maintenance.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        featured: true,
        sortOrder: 3
      }
    ]);
  });
  
  // Special services endpoint
  app.get('/api/special-services', (req, res) => {
    res.json([
      {
        id: 1,
        name: "Custom Feed Mixing",
        description: "We create custom feed blends tailored to your livestock's specific nutritional needs.",
        icon: "Settings",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Delivery Service",
        description: "Free delivery on orders over $100 within 20 miles of our store.",
        icon: "Truck",
        featured: true,
        sortOrder: 2
      },
      {
        id: 3,
        name: "Expert Consultation",
        description: "Our experienced team provides personalized advice for your farming and ranching needs.",
        icon: "MessageCircle",
        featured: true,
        sortOrder: 3
      }
    ]);
  });
  
  // Featured brands endpoint
  app.get('/api/featured-brands', (req, res) => {
    res.json([
      {
        id: 1,
        name: "Purina",
        description: "Premium animal nutrition products trusted by farmers worldwide.",
        logoUrl: "https://via.placeholder.com/200x100/0066CC/FFFFFF?text=PURINA",
        websiteUrl: "https://purina.com",
        featured: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: "Blue Buffalo",
        description: "Natural pet food made with real meat and wholesome ingredients.",
        logoUrl: "https://via.placeholder.com/200x100/1E88E5/FFFFFF?text=BLUE+BUFFALO",
        websiteUrl: "https://bluebuffalo.com",
        featured: true,
        sortOrder: 2
      }
    ]);
  });
  
  // Use Vite's middleware to serve frontend files
  app.use(vite.middlewares);
  
  // Start server
  const port = 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startDevServer().catch(console.error);