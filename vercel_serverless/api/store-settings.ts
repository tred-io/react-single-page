import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { getClientTables } from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const clientName = 'brown_feed';
    const tables = getClientTables(clientName);

    if (req.method === 'GET') {
      const [settings] = await db.select().from(tables.storeSettings).limit(1);
      
      if (!settings) {
        // Return default Brown Feed Store data
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
          aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County.",
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
        res.status(200).json(defaultSettings);
        return;
      }
      
      res.status(200).json(settings);
    } else if (req.method === 'PUT') {
      const [updated] = await db
        .update(tables.storeSettings)
        .set(req.body)
        .where(eq(tables.storeSettings.id, 1))
        .returning();
      
      res.status(200).json(updated);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
