import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Create Brown Feed Store settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brown_feed_store_settings (
        id INTEGER PRIMARY KEY,
        store_name VARCHAR(255),
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
        primary_color VARCHAR(10),
        secondary_color VARCHAR(10),
        accent_color VARCHAR(10),
        font_family VARCHAR(100),
        facebook_url TEXT,
        instagram_url TEXT,
        x_url TEXT,
        google_url TEXT,
        yelp_url TEXT,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT
      )
    `);

    // Create Brown Feed Store product categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brown_feed_product_categories (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image_url TEXT,
        icon_name VARCHAR(100),
        items JSONB,
        display_order INTEGER
      )
    `);

    // Create Brown Feed Store special services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brown_feed_special_services (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        icon_name VARCHAR(100),
        display_order INTEGER
      )
    `);

    // Create Brown Feed Store featured brands table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brown_feed_featured_brands (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255),
        logo_url TEXT,
        display_order INTEGER
      )
    `);

    // Insert default Brown Feed Store data
    await pool.query(`
      INSERT INTO brown_feed_store_settings (
        id, store_name, tagline, address, phone, email,
        monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours,
        about_title, about_description, about_story, founded_year,
        hero_image_url, about_image_url, primary_color, secondary_color, accent_color, font_family,
        seo_title, seo_description, seo_keywords
      ) VALUES (
        1, 'Brown Feed Store', 'Your Trusted Agricultural Partner in Lampasas, Texas',
        '1234 Highway 281, Lampasas, TX 76550', '(512) 555-1234', 'info@brownfeedstore.com',
        '7:00 AM - 6:00 PM', '7:00 AM - 6:00 PM', '7:00 AM - 6:00 PM', '7:00 AM - 6:00 PM', '7:00 AM - 6:00 PM', '7:00 AM - 6:00 PM', '9:00 AM - 4:00 PM',
        'About Brown Feed Store', 'A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades',
        'Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and expert advice.',
        '1985',
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        '#166534', '#15803d', '#22c55e', 'Inter',
        'Brown Feed Store - Your Trusted Agricultural Partner in Lampasas, Texas',
        'Brown Feed Store has been serving Lampasas County with quality livestock feed, pet supplies, and farm equipment since 1985.',
        'feed store, livestock feed, pet food, farm supplies, Lampasas Texas'
      ) ON CONFLICT (id) DO NOTHING
    `);

    // Insert default product categories
    await pool.query(`
      INSERT INTO brown_feed_product_categories (id, title, description, image_url, icon_name, items, display_order) VALUES
      (1, 'Livestock Feed', 'Complete nutrition for cattle, horses, goats, sheep, and swine',
       'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
       'Wheat', '["Cattle Feed & Supplements", "Horse Feed & Hay", "Goat & Sheep Feed", "Swine Feed", "Range Cubes & Mineral Blocks"]', 1),
      (2, 'Pet Food & Supplies', 'Premium nutrition and supplies for dogs, cats, and small animals',
       'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
       'Dog', '["Premium Dog Food", "Cat Food & Treats", "Pet Toys & Accessories", "Leashes & Collars", "Pet Health Supplements"]', 2),
      (3, 'Farm Equipment & Tools', 'Essential tools and equipment for farm operations',
       'https://images.unsplash.com/photo-1574263867128-73b8bdb2c7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
       'Wrench', '["Hand Tools", "Water Systems", "Fencing Supplies", "Safety Equipment", "Maintenance Tools"]', 3)
      ON CONFLICT (id) DO NOTHING
    `);

    // Insert default special services
    await pool.query(`
      INSERT INTO brown_feed_special_services (id, title, description, icon_name, display_order) VALUES
      (1, 'Expert Consultation', 'Get personalized advice from our experienced team on nutrition and animal care', 'Users', 1),
      (2, 'Feed Delivery', 'Convenient delivery service for bulk orders throughout Lampasas County', 'Truck', 2),
      (3, 'Custom Feed Mixing', 'Specialized feed blends tailored to your livestock specific needs', 'Settings', 3)
      ON CONFLICT (id) DO NOTHING
    `);

    res.status(200).json({ 
      message: 'Brown Feed Store database initialized successfully',
      tables: ['brown_feed_store_settings', 'brown_feed_product_categories', 'brown_feed_special_services', 'brown_feed_featured_brands']
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      message: 'Database initialization failed', 
      error: error.message 
    });
  }
}