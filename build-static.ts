import fs from 'fs/promises';
import path from 'path';
import { storage } from './server/storage';

async function generateStaticPages() {
  console.log('🏗️  Generating static pages with SEO optimization...');
  
  // Get current store data
  const storeSettings = await storage.getStoreSettings();
  const productCategories = await storage.getProductCategories();
  
  if (!storeSettings) {
    throw new Error('Store settings not found');
  }

  // Create the HTML template with all content pre-rendered
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    
    <!-- SEO Meta Tags -->
    <title>${storeSettings.storeName} - Your Local Agricultural Supply in Lampasas, TX</title>
    <meta name="description" content="${storeSettings.aboutDescription} Located at ${storeSettings.address}. Call ${storeSettings.phone} for quality livestock feed, pet supplies, and farming equipment.">
    <meta name="keywords" content="feed store, livestock feed, pet supplies, farming equipment, agricultural supply, Lampasas Texas, animal feed, farm supplies">
    <meta name="author" content="${storeSettings.storeName}">
    
    <!-- Open Graph tags for social media -->
    <meta property="og:title" content="${storeSettings.storeName} - Agricultural Supply in Lampasas, TX">
    <meta property="og:description" content="${storeSettings.aboutDescription} Serving Lampasas County since ${storeSettings.foundedYear}.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://brownfeedstore.com">
    <meta property="og:image" content="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${storeSettings.storeName} - Agricultural Supply">
    <meta name="twitter:description" content="${storeSettings.aboutDescription}">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630">
    
    <!-- Local Business Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "${storeSettings.storeName}",
      "description": "${storeSettings.aboutDescription}",
      "foundingDate": "${storeSettings.foundedYear}",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "${storeSettings.address.split(',')[0]}",
        "addressLocality": "Lampasas",
        "addressRegion": "TX",
        "postalCode": "76550"
      },
      "telephone": "${storeSettings.phone}",
      ${storeSettings.email ? `"email": "${storeSettings.email}",` : ''}
      "openingHours": [
        "Mo-Fr ${storeSettings.mondayFridayHours}",
        "Sa ${storeSettings.saturdayHours}",
        "Su ${storeSettings.sundayHours}"
      ],
      "priceRange": "$$",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Agricultural Supplies",
        "itemListElement": [
          ${productCategories.map(category => `{
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "${category.title}",
              "description": "${category.description}"
            }
          }`).join(',\n          ')}
        ]
      }
    }
    </script>
    
    <!-- Product Categories Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Product Categories",
      "itemListElement": [
        ${productCategories.map((category, index) => `{
          "@type": "ListItem",
          "position": ${index + 1},
          "item": {
            "@type": "Product",
            "name": "${category.title}",
            "description": "${category.description}",
            "image": "${category.imageUrl}"
          }
        }`).join(',\n        ')}
      ]
    }
    </script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <!-- Preload critical images -->
    <link rel="preload" as="image" href="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080">
  </head>
  <body>
    <!-- Pre-rendered content for SEO -->
    <div id="seo-content" style="display: none;">
      <h1>${storeSettings.storeName}</h1>
      <p>${storeSettings.tagline}</p>
      <p>${storeSettings.aboutDescription}</p>
      <div>
        <h2>Store Information</h2>
        <p>Address: ${storeSettings.address}</p>
        <p>Phone: ${storeSettings.phone}</p>
        ${storeSettings.email ? `<p>Email: ${storeSettings.email}</p>` : ''}
        <p>Hours: Monday-Friday ${storeSettings.mondayFridayHours}, Saturday ${storeSettings.saturdayHours}, Sunday ${storeSettings.sundayHours}</p>
      </div>
      <div>
        <h2>Our Story</h2>
        <p>${storeSettings.aboutStory}</p>
      </div>
      <div>
        <h2>Products &amp; Services</h2>
        ${productCategories.map(category => `
          <div>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
            <ul>
              ${category.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- React App Root -->
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  // Write the optimized HTML file
  await fs.writeFile(path.join(process.cwd(), 'client', 'index.html'), html);
  
  console.log('✅ Static pages generated with SEO optimization!');
  console.log(`📄 Generated for: ${storeSettings.storeName}`);
  console.log(`🏷️  ${productCategories.length} product categories included`);
}

// Run the build
generateStaticPages().catch(console.error);