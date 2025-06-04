import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, text, varchar, integer } from 'drizzle-orm/pg-core';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

const brownFeedSpecialServices = pgTable('brown_feed_special_services', {
  id: integer('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  iconName: varchar('icon_name', { length: 100 }),
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
      const services = await db.select().from(brownFeedSpecialServices).orderBy(brownFeedSpecialServices.displayOrder);
      
      if (services.length === 0) {
        const defaultServices = [
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
        ];
        
        await db.insert(brownFeedSpecialServices).values(defaultServices);
        return res.status(200).json(defaultServices);
      }
      
      return res.status(200).json(services);
    }

    if (req.method === 'POST') {
      const [newService] = await db.insert(brownFeedSpecialServices).values(req.body).returning();
      return res.status(201).json(newService);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const [updated] = await db
        .update(brownFeedSpecialServices)
        .set(req.body)
        .where(eq(brownFeedSpecialServices.id, parseInt(id)))
        .returning();
      
      return res.status(200).json(updated);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }
}