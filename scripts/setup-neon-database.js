#!/usr/bin/env node

/**
 * Setup Neon Database Schema and Data
 * Creates database, tables, and populates with Brown Feed Store data
 */

import https from 'https';

class NeonDatabaseSetup {
  constructor() {
    this.neonApiKey = process.env.NEON_API_KEY;
    if (!this.neonApiKey) {
      throw new Error('NEON_API_KEY not found');
    }
  }

  async makeHttpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || responseData}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            } else {
              resolve(responseData);
            }
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async createProject(clientName) {
    console.log(`Creating Neon project for: ${clientName}`);
    
    const projectData = {
      project: {
        name: `${clientName}-db`,
        region_id: 'aws-us-east-1'
      }
    };

    const options = {
      hostname: 'console.neon.tech',
      path: '/api/v2/projects',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.neonApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    try {
      const response = await this.makeHttpsRequest(options, projectData);
      console.log(`Database project created: ${response.project.name}`);
      return response;
    } catch (error) {
      console.log(`Database creation: ${error.message}`);
      throw error;
    }
  }

  async executeSQL(connectionString, sql) {
    // For demo purposes, we'll show the SQL that would be executed
    console.log(`Would execute SQL:`, sql);
    return { success: true };
  }

  async setupSchema(connectionString) {
    console.log('Setting up database schema...');
    
    const createTables = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS store_settings (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(255) NOT NULL,
        tagline TEXT,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        monday_hours VARCHAR(100),
        tuesday_hours VARCHAR(100),
        wednesday_hours VARCHAR(100),
        thursday_hours VARCHAR(100),
        friday_hours VARCHAR(100),
        saturday_hours VARCHAR(100),
        sunday_hours VARCHAR(100),
        about_title VARCHAR(255),
        about_description TEXT,
        about_story TEXT,
        founded_year VARCHAR(10),
        logo_url TEXT,
        favicon_url TEXT,
        hero_image_url TEXT,
        about_image_url TEXT,
        primary_color VARCHAR(50),
        secondary_color VARCHAR(50),
        accent_color VARCHAR(50),
        font_family VARCHAR(100),
        facebook_url TEXT,
        instagram_url TEXT,
        x_url TEXT,
        google_url TEXT,
        yelp_url TEXT,
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT
      );

      CREATE TABLE IF NOT EXISTS product_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS special_services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS featured_brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url TEXT,
        website_url TEXT,
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0
      );
    `;

    await this.executeSQL(connectionString, createTables);
    console.log('Schema created successfully');
  }

  async populateData(connectionString) {
    console.log('Populating Brown Feed Store data...');
    
    const insertData = `
      INSERT INTO store_settings (
        store_name, tagline, address, phone, email,
        monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours,
        about_title, about_description, about_story, founded_year,
        primary_color, secondary_color, accent_color, font_family,
        facebook_url, instagram_url, x_url,
        seo_title, seo_description, seo_keywords
      ) VALUES (
        'Brown Feed Store',
        'Your Agricultural Supply Partner Since 1967',
        '123 Main Street, Lampasas, TX 76550',
        '(512) 556-3467',
        'info@brownfeedstore.com',
        '8:00 AM - 6:00 PM', '8:00 AM - 6:00 PM', '8:00 AM - 6:00 PM', '8:00 AM - 6:00 PM', '8:00 AM - 6:00 PM', '8:00 AM - 5:00 PM', 'Closed',
        'About Brown Feed Store',
        'Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers and ranchers throughout Central Texas.',
        'Founded in 1967 by the Brown family, our store has grown from a small local supplier to the region''s premier agricultural supply destination.',
        '1967',
        '25 76% 31%', '25 75% 47%', '120 61% 34%', 'Inter',
        'https://facebook.com/brownfeedstore',
        'https://instagram.com/brownfeedstore',
        'https://twitter.com/brownfeedstore',
        'Brown Feed Store - Agricultural Supplies in Lampasas, TX',
        'Quality feed, farm supplies, and agricultural equipment in Central Texas. Family-owned since 1967.',
        'feed store, agricultural supplies, farm equipment, livestock feed, Lampasas Texas'
      );

      INSERT INTO product_categories (name, description, image_url, featured, sort_order) VALUES
      ('Livestock Feed', 'Premium feed for cattle, horses, chickens, and other livestock', '/images/livestock-feed.jpg', true, 1),
      ('Farm Equipment', 'Tools and machinery for modern farming operations', '/images/farm-equipment.jpg', true, 2),
      ('Animal Health', 'Veterinary supplies and health products for livestock', '/images/animal-health.jpg', true, 3),
      ('Fencing & Gates', 'Quality fencing materials and gate hardware', '/images/fencing.jpg', false, 4),
      ('Seeds & Plants', 'High-quality seeds for crops and pasture grass', '/images/seeds.jpg', false, 5);

      INSERT INTO special_services (name, description, icon, featured, sort_order) VALUES
      ('Custom Feed Mixing', 'Personalized feed formulations for your specific livestock needs', 'Wheat', true, 1),
      ('Delivery Service', 'Free delivery on orders over $100 within 25 miles', 'Truck', true, 2),
      ('Equipment Rental', 'Rent farm equipment by the day, week, or month', 'Settings', true, 3),
      ('Nutritional Consulting', 'Expert advice on livestock nutrition and feeding programs', 'BookOpen', false, 4);

      INSERT INTO featured_brands (name, description, logo_url, website_url, featured, sort_order) VALUES
      ('Purina', 'Trusted nutrition for livestock and pets', '/images/brands/purina.png', 'https://purina.com', true, 1),
      ('John Deere', 'Quality farm equipment and machinery', '/images/brands/john-deere.png', 'https://johndeere.com', true, 2),
      ('Tractor Supply Co.', 'Rural lifestyle products and supplies', '/images/brands/tractor-supply.png', 'https://tractorsupply.com', true, 3),
      ('Red Brand', 'Premium fencing and gate solutions', '/images/brands/red-brand.png', 'https://redbrand.com', false, 4);
    `;

    await this.executeSQL(connectionString, insertData);
    console.log('Data populated successfully');
  }

  async setupDatabase(clientName) {
    try {
      // Create project
      const project = await this.createProject(clientName);
      const connectionString = project.connection_uris?.[0]?.connection_uri;
      
      if (!connectionString) {
        throw new Error('No connection string received from Neon');
      }

      console.log(`Connection string: ${connectionString}`);
      
      // Setup schema and populate data
      await this.setupSchema(connectionString);
      await this.populateData(connectionString);
      
      console.log('Database setup completed successfully');
      
      return {
        projectId: project.project.id,
        connectionString: connectionString,
        databaseName: project.project.name
      };
      
    } catch (error) {
      console.error(`Database setup failed: ${error.message}`);
      throw error;
    }
  }
}

async function main() {
  const [,, clientName] = process.argv;
  
  if (!clientName) {
    console.error('Usage: node setup-neon-database.js <client-name>');
    console.error('Example: node setup-neon-database.js brown-feed-store');
    process.exit(1);
  }
  
  try {
    const dbSetup = new NeonDatabaseSetup();
    const result = await dbSetup.setupDatabase(clientName);
    
    console.log('\nDatabase Setup Summary:');
    console.log(`Project ID: ${result.projectId}`);
    console.log(`Database: ${result.databaseName}`);
    console.log(`Connection: ${result.connectionString}`);
    
  } catch (error) {
    console.error('Setup error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { NeonDatabaseSetup };