import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, text, varchar, integer } from 'drizzle-orm/pg-core';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Brown Feed Store settings table
const brownFeedStoreSettings = pgTable('brown_feed_store_settings', {
  id: integer('id').primaryKey(),
  storeName: varchar('store_name', { length: 255 }),
  tagline: text('tagline'),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  mondayHours: varchar('monday_hours', { length: 100 }),
  tuesdayHours: varchar('tuesday_hours', { length: 100 }),
  wednesdayHours: varchar('wednesday_hours', { length: 100 }),
  thursdayHours: varchar('thursday_hours', { length: 100 }),
  fridayHours: varchar('friday_hours', { length: 100 }),
  saturdayHours: varchar('saturday_hours', { length: 100 }),
  sundayHours: varchar('sunday_hours', { length: 100 }),
  aboutTitle: varchar('about_title', { length: 255 }),
  aboutDescription: text('about_description'),
  aboutStory: text('about_story'),
  foundedYear: varchar('founded_year', { length: 10 }),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  heroImageUrl: text('hero_image_url'),
  aboutImageUrl: text('about_image_url'),
  primaryColor: varchar('primary_color', { length: 10 }),
  secondaryColor: varchar('secondary_color', { length: 10 }),
  accentColor: varchar('accent_color', { length: 10 }),
  fontFamily: varchar('font_family', { length: 100 }),
  facebookUrl: text('facebook_url'),
  instagramUrl: text('instagram_url'),
  xUrl: text('x_url'),
  googleUrl: text('google_url'),
  yelpUrl: text('yelp_url'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const [settings] = await db.select().from(brownFeedStoreSettings).where(eq(brownFeedStoreSettings.id, 1));
      
      if (!settings) {
        // Initialize with Brown Feed Store data if not exists
        const defaultSettings = {
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
        };
        
        await db.insert(brownFeedStoreSettings).values(defaultSettings);
        return res.status(200).json(defaultSettings);
      }
      
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      const [updated] = await db
        .update(brownFeedStoreSettings)
        .set(req.body)
        .where(eq(brownFeedStoreSettings.id, 1))
        .returning();
      
      return res.status(200).json(updated);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }
}