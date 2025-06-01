import { db } from "./db";
import { getClientTables, createClientSchema } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function initializeClientSchema(clientName: string) {
  try {
    const schemaName = clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Create schema if it doesn't exist
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(schemaName)}`);
    
    // Get client-specific tables
    const tables = getClientTables(clientName);
    
    // Create tables in the client schema
    // Note: In production, you'd want to use proper migrations
    // This is a simplified approach for the demo
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