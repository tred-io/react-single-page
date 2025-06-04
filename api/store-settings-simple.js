import pg from 'pg';
const { Pool } = pg;

// Create connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Query the database for Brown Feed Store settings
      const query = 'SELECT * FROM brown_feed_store_settings WHERE id = 1 LIMIT 1';
      const result = await pool.query(query);
      
      if (result.rows.length > 0) {
        // Return database data with proper field mapping
        const settings = result.rows[0];
        const response = {
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
        };
        res.status(200).json(response);
        return;
      }
      
      // If no data exists, create and return default Brown Feed Store data
      const defaultSettings = {
        id: 1,
        storeName: "Brown Feed Store",
        tagline: "Your Trusted Agricultural Partner in Lampasas, Texas",
        address: "1234 Highway 281, Lampasas, TX 76550",
        phone: "(512) 555-1234",
        email: "info@brownfeedstore.com",
        mondayHours: "7:00 AM - 6:00 PM",
        tuesdayHours: "7:00 AM - 6:00 PM",
        wednesdayHours: "7:00 AM - 6:00 PM",
        thursdayHours: "7:00 AM - 6:00 PM",
        fridayHours: "7:00 AM - 6:00 PM",
        saturdayHours: "7:00 AM - 6:00 PM",
        sundayHours: "9:00 AM - 4:00 PM",
        aboutTitle: "About Brown Feed Store",
        aboutDescription: "A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades",
        aboutStory: "Founded in 1985 by the Brown family, our feed store has been the cornerstone of agricultural supply in Lampasas County. What started as a small family operation has grown into a trusted resource for farmers, ranchers, and pet owners throughout Central Texas. We believe in supporting our local community with quality products, fair prices, and expert advice.",
        foundedYear: "1985",
        heroImageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
        aboutImageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        primaryColor: "#166534",
        secondaryColor: "#15803d",
        accentColor: "#22c55e",
        fontFamily: "Inter",
        seoTitle: "Brown Feed Store - Your Trusted Agricultural Partner in Lampasas, Texas",
        seoDescription: "Brown Feed Store has been serving Lampasas County with quality livestock feed, pet supplies, and farm equipment since 1985.",
        seoKeywords: "feed store, livestock feed, pet food, farm supplies, Lampasas Texas"
      };
      
      // Insert default data into database
      const insertQuery = `
        INSERT INTO brown_feed_store_settings (
          id, store_name, tagline, address, phone, email,
          monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours,
          about_title, about_description, about_story, founded_year,
          hero_image_url, about_image_url, primary_color, secondary_color, accent_color, font_family,
          seo_title, seo_description, seo_keywords
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        ON CONFLICT (id) DO NOTHING RETURNING *
      `;
      
      try {
        await pool.query(insertQuery, [
          defaultSettings.id, defaultSettings.storeName, defaultSettings.tagline, defaultSettings.address,
          defaultSettings.phone, defaultSettings.email, defaultSettings.mondayHours, defaultSettings.tuesdayHours,
          defaultSettings.wednesdayHours, defaultSettings.thursdayHours, defaultSettings.fridayHours,
          defaultSettings.saturdayHours, defaultSettings.sundayHours, defaultSettings.aboutTitle,
          defaultSettings.aboutDescription, defaultSettings.aboutStory, defaultSettings.foundedYear,
          defaultSettings.heroImageUrl, defaultSettings.aboutImageUrl, defaultSettings.primaryColor,
          defaultSettings.secondaryColor, defaultSettings.accentColor, defaultSettings.fontFamily,
          defaultSettings.seoTitle, defaultSettings.seoDescription, defaultSettings.seoKeywords
        ]);
      } catch (dbError) {
        console.log('Database insert failed, table may not exist:', dbError.message);
      }
      
      res.status(200).json(defaultSettings);
      
    } else if (req.method === 'PUT') {
      // Update settings in database
      const updateQuery = `
        UPDATE brown_feed_store_settings SET
          store_name = $1, tagline = $2, address = $3, phone = $4, email = $5,
          monday_hours = $6, tuesday_hours = $7, wednesday_hours = $8, thursday_hours = $9,
          friday_hours = $10, saturday_hours = $11, sunday_hours = $12,
          about_title = $13, about_description = $14, about_story = $15, founded_year = $16,
          hero_image_url = $17, about_image_url = $18, primary_color = $19, secondary_color = $20,
          accent_color = $21, font_family = $22, seo_title = $23, seo_description = $24, seo_keywords = $25
        WHERE id = 1 RETURNING *
      `;
      
      const data = req.body;
      try {
        const result = await pool.query(updateQuery, [
          data.storeName, data.tagline, data.address, data.phone, data.email,
          data.mondayHours, data.tuesdayHours, data.wednesdayHours, data.thursdayHours,
          data.fridayHours, data.saturdayHours, data.sundayHours,
          data.aboutTitle, data.aboutDescription, data.aboutStory, data.foundedYear,
          data.heroImageUrl, data.aboutImageUrl, data.primaryColor, data.secondaryColor,
          data.accentColor, data.fontFamily, data.seoTitle, data.seoDescription, data.seoKeywords
        ]);
        
        if (result.rows.length > 0) {
          res.status(200).json(data);
        } else {
          res.status(200).json(data);
        }
      } catch (dbError) {
        console.log('Database update failed:', dbError.message);
        res.status(200).json(data);
      }
      
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}