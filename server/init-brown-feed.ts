import { db } from "./db";
import { getClientTables } from "@shared/schema";

export async function initializeBrownFeedStore() {
  const clientName = 'brown_feed';
  const tables = getClientTables(clientName);

  try {
    // Create schema if it doesn't exist
    await db.execute(`CREATE SCHEMA IF NOT EXISTS ${clientName}`);
    
    // Create store_settings table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${clientName}.store_settings (
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
        seo_title VARCHAR(255) NOT NULL,
        seo_description TEXT NOT NULL,
        seo_keywords TEXT NOT NULL
      )
    `);

    // Create product_categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${clientName}.product_categories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL,
        items TEXT[] NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Create special_services table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${clientName}.special_services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon_name VARCHAR(100) NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Create featured_brands table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${clientName}.featured_brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Insert default Brown Feed Store settings
    await db.execute(`
      INSERT INTO ${clientName}.store_settings (
        store_name, tagline, address, phone, email,
        monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours,
        about_title, about_description, about_story, founded_year,
        hero_image_url, about_image_url,
        primary_color, secondary_color, accent_color, font_family,
        seo_title, seo_description, seo_keywords
      ) VALUES (
        'Brown Feed Store',
        'Your Trusted Agricultural Partner in Lampasas, Texas',
        '1234 Highway 281, Lampasas, TX 76550',
        '(512) 555-1234',
        'info@brownfeedstore.com',
        '7:00 AM - 6:00 PM',
        '7:00 AM - 6:00 PM',
        '7:00 AM - 6:00 PM',
        '7:00 AM - 6:00 PM',
        '7:00 AM - 6:00 PM',
        '7:00 AM - 6:00 PM',
        '9:00 AM - 4:00 PM',
        'About Brown Feed Store',
        'A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades',
        'Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and the kind of personal service that only comes from knowing our customers by name.',
        '1985',
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        '#166534',
        '#15803d',
        '#22c55e',
        'Inter',
        'Brown Feed Store - Your Trusted Agricultural Partner in Lampasas, Texas',
        'Brown Feed Store has been serving Lampasas County with quality livestock feed, pet supplies, and farm equipment since 1985. Family-owned business with expert agricultural consultation.',
        'feed store, livestock feed, pet food, farm supplies, Lampasas Texas, cattle feed, horse feed, agricultural supplies'
      )
      ON CONFLICT DO NOTHING
    `);

    // Insert product categories
    await db.execute(`
      INSERT INTO ${clientName}.product_categories (title, description, image_url, icon_name, items, display_order) VALUES
      (
        'Livestock Feed',
        'Complete nutrition for cattle, horses, goats, sheep, and swine',
        'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        'Wheat',
        ARRAY['Cattle Feed & Supplements', 'Horse Feed & Hay', 'Goat & Sheep Feed', 'Swine Feed', 'Range Cubes & Mineral Blocks'],
        1
      ),
      (
        'Pet Food & Supplies',
        'Premium nutrition and supplies for dogs, cats, and small animals',
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        'Dog',
        ARRAY['Premium Dog Food', 'Cat Food & Treats', 'Pet Toys & Accessories', 'Leashes & Collars', 'Pet Health Supplements'],
        2
      ),
      (
        'Poultry & Game Bird',
        'Specialized feeds for chickens, turkeys, ducks, and game birds',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        'Bird',
        ARRAY['Layer Feed', 'Broiler Feed', 'Turkey Feed', 'Game Bird Feed', 'Poultry Supplements'],
        3
      ),
      (
        'Farm Supplies',
        'Essential equipment and supplies for modern farming operations',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
        'Fish',
        ARRAY['Fencing Materials', 'Water Tanks & Troughs', 'Feed Buckets & Tools', 'Barn Equipment', 'Agricultural Tools'],
        4
      )
      ON CONFLICT DO NOTHING
    `);

    // Insert special services
    await db.execute(`
      INSERT INTO ${clientName}.special_services (title, description, icon_name, display_order) VALUES
      (
        'Expert Consultation',
        'Get personalized advice from our experienced team on nutrition and animal care',
        'Users',
        1
      ),
      (
        'Feed Delivery',
        'Convenient delivery service for bulk orders throughout Lampasas County',
        'Truck',
        2
      ),
      (
        'Nutritional Planning',
        'Custom feeding programs designed for your specific livestock needs',
        'BookOpen',
        3
      ),
      (
        'Emergency Supply',
        'After-hours emergency feed supply for critical situations',
        'Clock',
        4
      )
      ON CONFLICT DO NOTHING
    `);

    console.log(`Brown Feed Store database initialized successfully for client: ${clientName}`);
    return true;
  } catch (error) {
    console.error("Error initializing Brown Feed Store database:", error);
    throw error;
  }
}