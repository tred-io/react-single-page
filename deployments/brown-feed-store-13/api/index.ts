// Client: brown-feed-store-13
// Domain: brownfeedstore13.com

import type { Request, Response } from "express";
import { Pool } from '@neondatabase/serverless';

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper function to get client name from environment
function getClientName(): string {
  return process.env.CLIENT_NAME || 'brown_feed_store';
}

// Default store settings for new clients
function getDefaultStoreSettings() {
  return {
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
    aboutDescription: "Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas. We provide high-quality feed, farm supplies, and expert advice to help your operation thrive.",
    aboutStory: "Our story begins with a simple mission: to serve the hardworking farmers and ranchers of Central Texas with the highest quality products and most reliable service. Founded in 1967 by the Brown family, we've grown from a small local feed store to a comprehensive agricultural supply center.",
    foundedYear: "1967",
    logoUrl: null,
    faviconUrl: null,
    heroImageUrl: null,
    aboutImageUrl: null,
    primaryColor: "2 72% 8%",
    secondaryColor: "4 76% 8%",
    accentColor: "251 100% 19%",
    fontFamily: "Inter",
    facebookUrl: null,
    instagramUrl: null,
    xUrl: null,
    googleUrl: null,
    yelpUrl: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null
  };
}

function getDefaultProductCategories() {
  return [
    {
      id: 1,
      name: "Livestock Feed",
      description: "Premium quality feed for cattle, horses, sheep, goats, and poultry"
    },
    {
      id: 2,
      name: "Farm Supplies",
      description: "Essential tools and equipment for farm operations"
    },
    {
      id: 3,
      name: "Pet Food",
      description: "Nutritious food for dogs, cats, and other pets"
    },
    {
      id: 4,
      name: "Garden & Lawn",
      description: "Seeds, fertilizers, and supplies for your garden and lawn care"
    }
  ];
}

function getDefaultSpecialServices() {
  return [
    {
      id: 1,
      name: "Custom Feed Mixing",
      description: "Personalized feed formulations tailored to your livestock's specific nutritional needs"
    },
    {
      id: 2,
      name: "Delivery Service",
      description: "Convenient delivery of feed and supplies directly to your farm or ranch"
    },
    {
      id: 3,
      name: "Nutritional Consultation",
      description: "Expert advice on livestock nutrition and feed management from our specialists"
    }
  ];
}

function getDefaultFeaturedBrands() {
  return [
    {
      id: 1,
      name: "Purina",
      description: "Trusted nutrition for livestock and pets with scientifically formulated feeds"
    },
    {
      id: 2,
      name: "Nutrena",
      description: "Premium feeds designed to optimize animal performance and health"
    },
    {
      id: 3,
      name: "MoorMan's",
      description: "Quality nutrition products backed by research and field-tested results"
    }
  ];
}

// API route handlers
async function handleStoreSettings(req: Request, res: Response) {
  try {
    if (req.method === 'GET') {
      if (!process.env.DATABASE_URL) {
        return res.json(getDefaultStoreSettings());
      }

      const clientName = getClientName();
      const result = await pool.query(
        `SELECT * FROM ${clientName}.store_settings LIMIT 1`
      );

      if (result.rows.length === 0) {
        return res.json(getDefaultStoreSettings());
      }

      const settings = result.rows[0];
      return res.json({
        id: settings.id,
        storeName: settings.store_name,
        tagline: settings.tagline,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        mondayHours: settings.monday_hours,
        tuesdayHours: settings.tuesday_hours,
        wednesdayHours: settings.wednesday_hours,
        thursdayHours: settings.thursday_hours,
        fridayHours: settings.friday_hours,
        saturdayHours: settings.saturday_hours,
        sundayHours: settings.sunday_hours,
        aboutTitle: settings.about_title,
        aboutDescription: settings.about_description,
        aboutStory: settings.about_story,
        foundedYear: settings.founded_year,
        logoUrl: settings.logo_url,
        faviconUrl: settings.favicon_url,
        heroImageUrl: settings.hero_image_url,
        aboutImageUrl: settings.about_image_url,
        primaryColor: settings.primary_color,
        secondaryColor: settings.secondary_color,
        accentColor: settings.accent_color,
        fontFamily: settings.font_family,
        facebookUrl: settings.facebook_url,
        instagramUrl: settings.instagram_url,
        xUrl: settings.x_url,
        googleUrl: settings.google_url,
        yelpUrl: settings.yelp_url,
        seoTitle: settings.seo_title,
        seoDescription: settings.seo_description,
        seoKeywords: settings.seo_keywords
      });
    }

    if (req.method === 'PUT') {
      const settings = req.body;
      const clientName = getClientName();

      await pool.query(
        `UPDATE ${clientName}.store_settings SET 
         store_name = $1, tagline = $2, address = $3, phone = $4, email = $5,
         monday_hours = $6, tuesday_hours = $7, wednesday_hours = $8, thursday_hours = $9,
         friday_hours = $10, saturday_hours = $11, sunday_hours = $12,
         about_title = $13, about_description = $14, about_story = $15, founded_year = $16,
         logo_url = $17, favicon_url = $18, hero_image_url = $19, about_image_url = $20,
         primary_color = $21, secondary_color = $22, accent_color = $23, font_family = $24,
         facebook_url = $25, instagram_url = $26, x_url = $27, google_url = $28,
         yelp_url = $29, seo_title = $30, seo_description = $31, seo_keywords = $32,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [
          settings.storeName, settings.tagline, settings.address, settings.phone, settings.email,
          settings.mondayHours, settings.tuesdayHours, settings.wednesdayHours, settings.thursdayHours,
          settings.fridayHours, settings.saturdayHours, settings.sundayHours,
          settings.aboutTitle, settings.aboutDescription, settings.aboutStory, settings.foundedYear,
          settings.logoUrl, settings.faviconUrl, settings.heroImageUrl, settings.aboutImageUrl,
          settings.primaryColor, settings.secondaryColor, settings.accentColor, settings.fontFamily,
          settings.facebookUrl, settings.instagramUrl, settings.xUrl, settings.googleUrl,
          settings.yelpUrl, settings.seoTitle, settings.seoDescription, settings.seoKeywords
        ]
      );

      return res.json({ success: true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Store settings error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleProductCategories(req: Request, res: Response) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(getDefaultProductCategories());
    }

    const clientName = getClientName();
    const result = await pool.query(
      `SELECT * FROM ${clientName}.product_categories ORDER BY id`
    );

    return res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description
    })));
  } catch (error) {
    console.error('Product categories error:', error);
    return res.json(getDefaultProductCategories());
  }
}

async function handleSpecialServices(req: Request, res: Response) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(getDefaultSpecialServices());
    }

    const clientName = getClientName();
    const result = await pool.query(
      `SELECT * FROM ${clientName}.special_services ORDER BY id`
    );

    return res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description
    })));
  } catch (error) {
    console.error('Special services error:', error);
    return res.json(getDefaultSpecialServices());
  }
}

async function handleFeaturedBrands(req: Request, res: Response) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(getDefaultFeaturedBrands());
    }

    const clientName = getClientName();
    const result = await pool.query(
      `SELECT * FROM ${clientName}.featured_brands ORDER BY id`
    );

    return res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description
    })));
  } catch (error) {
    console.error('Featured brands error:', error);
    return res.json(getDefaultFeaturedBrands());
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Route requests to appropriate handlers
    if (pathname === '/api/store-settings') {
      return await handleStoreSettings(req, res);
    }
    
    if (pathname === '/api/product-categories') {
      return await handleProductCategories(req, res);
    }
    
    if (pathname === '/api/special-services') {
      return await handleSpecialServices(req, res);
    }
    
    if (pathname === '/api/featured-brands') {
      return await handleFeaturedBrands(req, res);
    }

    if (pathname === '/api/health') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}