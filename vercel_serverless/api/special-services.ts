import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { getClientTables } from '../shared/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const clientName = 'brown_feed';
    const tables = getClientTables(clientName);

    if (req.method === 'GET') {
      const services = await db.select().from(tables.specialServices).orderBy(tables.specialServices.displayOrder);
      
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
          }
        ];
        res.status(200).json(defaultServices);
        return;
      }
      
      res.status(200).json(services);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
