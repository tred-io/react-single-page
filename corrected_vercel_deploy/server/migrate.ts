import { db } from './db';
import { storeSettings, productCategories, specialServices, featuredBrands } from '../shared/schema';

async function migrate() {
  try {
    // Create tables by running the schema
    console.log('Creating database tables...');
    
    // Insert default store settings if none exist
    const existingSettings = await db.select().from(storeSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(storeSettings).values({
        storeName: "Brown Feed Store",
        tagline: "Quality Agricultural Supplies Since 1985",
        address: "123 Main Street, Lampasas, TX 76550",
        phone: "(512) 556-7890",
        email: "info@brownfeedstore.com",
        mondayHours: "8:00 AM - 6:00 PM",
        tuesdayHours: "8:00 AM - 6:00 PM",
        wednesdayHours: "8:00 AM - 6:00 PM",
        thursdayHours: "8:00 AM - 6:00 PM",
        fridayHours: "8:00 AM - 6:00 PM",
        saturdayHours: "8:00 AM - 5:00 PM",
        sundayHours: "10:00 AM - 4:00 PM",
        aboutTitle: "About Brown Feed Store",
        aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
        aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers and their unique needs.",
        foundedYear: "1985",
        logoUrl: "",
        faviconUrl: "",
        heroImageUrl: "",
        aboutImageUrl: "",
        primaryColor: "#8B4513",
        secondaryColor: "#2F4F4F", 
        accentColor: "#CD853F",
        fontFamily: "Inter",
        facebookUrl: "",
        instagramUrl: "",
        xUrl: "",
        googleUrl: "",
        yelpUrl: "",
        seoTitle: "Brown Feed Store - Quality Agricultural Supplies in Lampasas, TX",
        seoDescription: "Your trusted agricultural partner since 1985. Premium livestock feed, farming equipment, and expert advice in Lampasas County, Texas.",
        seoKeywords: "feed store, livestock feed, agricultural supplies, farming equipment, Lampasas Texas, cattle feed, horse feed"
      });
    }

    // Insert default product categories if none exist
    const existingCategories = await db.select().from(productCategories).limit(1);
    if (existingCategories.length === 0) {
      await db.insert(productCategories).values([
        {
          title: "Livestock Feed",
          description: "Premium nutrition for cattle, horses, sheep, and goats",
          imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
          iconName: "Wheat",
          items: ["Cattle Feed", "Horse Feed", "Sheep & Goat Feed", "Mineral Supplements", "Hay & Forage"],
          displayOrder: 1
        },
        {
          title: "Pet Supplies",
          description: "Everything your furry friends need to stay happy and healthy",
          imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
          iconName: "Heart",
          items: ["Dog Food", "Cat Food", "Pet Toys", "Grooming Supplies", "Pet Medications"],
          displayOrder: 2
        },
        {
          title: "Farm Equipment",
          description: "Tools and machinery to keep your operation running smoothly",
          imageUrl: "https://images.unsplash.com/photo-1574924441084-cc259e5d645c?w=400",
          iconName: "Wrench",
          items: ["Hand Tools", "Power Equipment", "Fencing Supplies", "Water Systems", "Maintenance Parts"],
          displayOrder: 3
        }
      ]);
    }

    // Insert default special services if none exist
    const existingServices = await db.select().from(specialServices).limit(1);
    if (existingServices.length === 0) {
      await db.insert(specialServices).values([
        {
          title: "Expert Consultation",
          description: "Get personalized advice from our agricultural specialists",
          iconName: "Users",
          displayOrder: 1
        },
        {
          title: "Local Delivery",
          description: "Free delivery for orders over $100 within 20 miles",
          iconName: "Truck",
          displayOrder: 2
        },
        {
          title: "Custom Feed Mixing",
          description: "Tailored nutrition solutions for your livestock",
          iconName: "Settings",
          displayOrder: 3
        }
      ]);
    }

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();