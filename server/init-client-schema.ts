import { db } from "./db";
import { getClientTables, createClientSchema } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function initializeClientSchema(clientName: string) {
  try {
    const schemaName = clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Create schema if it doesn't exist
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(schemaName)}`);
    
    // Create tables in the client schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${sql.identifier(schemaName)}.store_settings (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(255) NOT NULL,
        tagline TEXT NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        monday_hours VARCHAR(100) NOT NULL,
        tuesday_hours VARCHAR(100) NOT NULL,
        wednesday_hours VARCHAR(100) NOT NULL,
        thursday_hours VARCHAR(100) NOT NULL,
        friday_hours VARCHAR(100) NOT NULL,
        saturday_hours VARCHAR(100) NOT NULL,
        sunday_hours VARCHAR(100) NOT NULL,
        about_title VARCHAR(255) NOT NULL,
        about_description TEXT NOT NULL,
        about_story TEXT NOT NULL,
        founded_year VARCHAR(10) NOT NULL,
        logo_url TEXT,
        favicon_url TEXT,
        hero_image_url TEXT,
        about_image_url TEXT,
        primary_color VARCHAR(20) NOT NULL,
        secondary_color VARCHAR(20) NOT NULL,
        accent_color VARCHAR(20) NOT NULL,
        font_family VARCHAR(100) NOT NULL,
        facebook_url TEXT,
        instagram_url TEXT,
        x_url TEXT,
        google_url TEXT,
        yelp_url TEXT,
        seo_title TEXT NOT NULL,
        seo_description TEXT NOT NULL,
        seo_keywords TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${sql.identifier(schemaName)}.product_categories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL,
        items TEXT[] NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${sql.identifier(schemaName)}.special_services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ${sql.identifier(schemaName)}.featured_brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log(`Initialized schema for client: ${clientName}`);
    
    return true;
  } catch (error) {
    console.error(`Failed to initialize schema for ${clientName}:`, error);
    return false;
  }
}

// Initialize default data for a new client
export async function initializeClientData(clientName: string, domain: string) {
  const tables = getClientTables(clientName);
  
  try {
    // Check if store settings already exist
    const existingSettings = await db.select().from(tables.storeSettings).limit(1);
    
    if (existingSettings.length === 0) {
      // Create default store settings
      await db.insert(tables.storeSettings).values({
        storeName: clientName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tagline: "Your trusted local business",
        address: "123 Main Street, Your City, State 12345",
        phone: "(555) 123-4567",
        email: `info@${domain}`,
        mondayHours: "9:00 AM - 6:00 PM",
        tuesdayHours: "9:00 AM - 6:00 PM",
        wednesdayHours: "9:00 AM - 6:00 PM",
        thursdayHours: "9:00 AM - 6:00 PM",
        fridayHours: "9:00 AM - 6:00 PM",
        saturdayHours: "9:00 AM - 4:00 PM",
        sundayHours: "Closed",
        aboutTitle: `About ${clientName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        aboutDescription: "A trusted local business serving our community",
        aboutStory: "Our story begins with a commitment to quality and service...",
        foundedYear: new Date().getFullYear().toString(),
        primaryColor: "#2563eb",
        secondaryColor: "#64748b", 
        accentColor: "#f59e0b",
        fontFamily: "Inter",
        seoTitle: `${clientName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Quality Service`,
        seoDescription: "Your trusted local business providing quality products and services.",
        seoKeywords: "local business, quality service, trusted provider",
      });
      
      console.log(`Initialized default data for client: ${clientName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to initialize data for ${clientName}:`, error);
    return false;
  }
}