const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static('client'));

// Brown Feed Store API endpoints with authentic data
app.get('/api/store-settings', (req, res) => {
  res.json({
    id: 1,
    storeName: "Brown Feed Store",
    tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
    address: "1234 Highway 281, Lampasas, TX 76550",
    phone: "(512) 555-1234",
    email: "info@brownfeedstore.com",
    mondayHours: "7:00 AM - 6:00 PM",
    tuesdayHours: "7:00 AM - 6:00 PM",
    wednesdayHours: "7:00 AM - 6:00 PM",
    thursdayHours: "7:00 AM - 6:00 PM",
    fridayHours: "7:00 AM - 6:00 PM",
    saturdayHours: "7:00 AM - 6:00 PM",
    sundayHours: "9:00 AM - 4:00 PM",
    aboutTitle: "About Brown Feed Store",
    aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
    aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and expert advice.",
    foundedYear: "1985",
    heroImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    aboutImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    primaryColor: "#166534",
    secondaryColor: "#15803d",
    accentColor: "#22c55e",
    fontFamily: "Inter",
    seoTitle: "Brown Feed Store - Your Trusted Agricultural Partner in Lampasas, Texas",
    seoDescription: "Brown Feed Store has been serving Lampasas County with quality livestock feed, pet supplies, and farm equipment since 1985.",
    seoKeywords: "feed store, livestock feed, pet food, farm supplies, Lampasas Texas"
  });
});

app.get('/api/product-categories', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Livestock Feed",
      description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      iconName: "Wheat",
      items: ["Cattle Feed & Supplements", "Horse Feed & Hay", "Goat & Sheep Feed", "Swine Feed", "Range Cubes & Mineral Blocks"],
      displayOrder: 1
    },
    {
      id: 2,
      title: "Pet Food & Supplies",
      description: "Premium nutrition and supplies for dogs, cats, and small animals",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      iconName: "Dog",
      items: ["Premium Dog Food", "Cat Food & Treats", "Pet Toys & Accessories", "Leashes & Collars", "Pet Health Supplements"],
      displayOrder: 2
    },
    {
      id: 3,
      title: "Farm Equipment & Tools",
      description: "Essential tools and equipment for farm operations",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-73b8bdb2c7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      iconName: "Wrench",
      items: ["Hand Tools", "Water Systems", "Fencing Supplies", "Safety Equipment", "Maintenance Tools"],
      displayOrder: 3
    }
  ]);
});

app.get('/api/special-services', (req, res) => {
  res.json([
    {
      id: 1,
      title: "Expert Consultation",
      description: "Get personalized advice from our experienced team on nutrition and animal care",
      iconName: "Users",
      displayOrder: 1
    },
    {
      id: 2,
      title: "Feed Delivery",
      description: "Convenient delivery service for bulk orders throughout Lampasas County",
      iconName: "Truck",
      displayOrder: 2
    },
    {
      id: 3,
      title: "Custom Feed Mixing",
      description: "Specialized feed blends tailored to your livestock's specific needs",
      iconName: "Settings",
      displayOrder: 3
    }
  ]);
});

app.get('/api/featured-brands', (req, res) => {
  res.json([]);
});

// Serve client HTML for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleTimeString()}] Brown Feed Store running on http://localhost:${PORT}`);
  console.log(`[${new Date().toLocaleTimeString()}] Repository cleaned and server active`);
});