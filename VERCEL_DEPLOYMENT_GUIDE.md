# Deploy to Vercel with Free Database (Option 2)

## Overview
This guide shows how to deploy your business website to Vercel with a free PostgreSQL database, maintaining full admin panel functionality.

## Step 1: Set up Free Database

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create free account
2. Create new project → Get connection string
3. Free tier: 512MB storage, 100 hours compute/month

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create free account  
2. Create new project → Settings → Database → Connection string
3. Free tier: 500MB storage, 50,000 requests/month

## Step 2: Prepare for Vercel

Create these files in your project:

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### `package.json` - Add build script:
```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

## Step 3: Convert API Routes

Create `/api` directory with these files:

### `/api/store-settings.js`
```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const [settings] = await sql`SELECT * FROM store_settings LIMIT 1`;
    res.json(settings || null);
  } else if (req.method === 'PUT') {
    const data = req.body;
    const [updated] = await sql`
      UPDATE store_settings 
      SET ${sql(data, ...Object.keys(data))}
      WHERE id = 1 
      RETURNING *
    `;
    res.json({ success: true, data: updated });
  }
}
```

## Step 4: Database Setup

Run these SQL commands in your database dashboard:

```sql
-- Store settings table
CREATE TABLE store_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL,
  tagline TEXT NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  -- ... (all other fields from schema)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO store_settings (store_name, tagline, address, phone, ...) 
VALUES ('Brown Feed Store', 'Quality Agricultural Supplies Since 1985', ...);
```

## Step 5: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `DATABASE_URL` = your database connection string

3. **Deploy**
   - Vercel automatically builds and deploys
   - Your site will be live at `your-project.vercel.app`

## File Upload Considerations

For Vercel deployment, file uploads need special handling:

### Option A: Use Vercel Blob (Free tier: 10GB)
```javascript
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  const blob = await put('filename.jpg', req.body, {
    access: 'public',
  });
  res.json({ url: blob.url });
}
```

### Option B: Use Cloudinary (Free tier: 25GB)
1. Sign up at cloudinary.com
2. Add API keys to Vercel environment variables
3. Update upload endpoints to use Cloudinary API

## Cost Breakdown (Monthly)

**Free Option:**
- Vercel: $0 (Hobby plan)
- Neon Database: $0 (Free tier)
- Vercel Blob: $0 (10GB included)
- **Total: $0/month**

**If you exceed free limits:**
- Vercel Pro: $20/month
- Neon Pro: $19/month
- **Total: $39/month**

## Benefits of This Setup

✅ Real-time admin panel functionality
✅ Automatic scaling
✅ Global CDN
✅ HTTPS included
✅ Custom domain support
✅ Git-based deployments

Would you like me to help you implement any specific part of this deployment process?