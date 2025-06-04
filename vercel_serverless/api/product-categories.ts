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
      const categories = await db.select().from(tables.productCategories).orderBy(tables.productCategories.displayOrder);
      
      if (categories.length === 0) {
        // Return default categories
        const defaultCategories = [
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
          }
        ];
        res.status(200).json(defaultCategories);
        return;
      }
      
      res.status(200).json(categories);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
