import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, text, varchar, integer } from 'drizzle-orm/pg-core';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

const brownFeedFeaturedBrands = pgTable('brown_feed_featured_brands', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  logoUrl: text('logo_url'),
  displayOrder: integer('display_order'),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const brands = await db.select().from(brownFeedFeaturedBrands).orderBy(brownFeedFeaturedBrands.displayOrder);
      
      if (brands.length === 0) {
        const defaultBrands = [
          {
            id: 1,
            name: "Purina",
            logoUrl: "https://www.purina.com/sites/default/files/2021-02/Purina-Logo_0.png",
            displayOrder: 1
          },
          {
            id: 2,
            name: "Nutrena",
            logoUrl: "https://www.nutrenaworld.com/themes/custom/nutrena/images/nutrena-logo.png",
            displayOrder: 2
          },
          {
            id: 3,
            name: "Producer's Pride",
            logoUrl: "https://www.tractorsupply.com/brand/producers-pride",
            displayOrder: 3
          }
        ];
        
        await db.insert(brownFeedFeaturedBrands).values(defaultBrands);
        return res.status(200).json(defaultBrands);
      }
      
      return res.status(200).json(brands);
    }

    if (req.method === 'POST') {
      const [newBrand] = await db.insert(brownFeedFeaturedBrands).values(req.body).returning();
      return res.status(201).json(newBrand);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const [updated] = await db
        .update(brownFeedFeaturedBrands)
        .set(req.body)
        .where(eq(brownFeedFeaturedBrands.id, parseInt(id)))
        .returning();
      
      return res.status(200).json(updated);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }
}