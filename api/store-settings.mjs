export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const settings = {
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
    
    return res.status(200).json(settings);
  }

  if (req.method === 'PUT') {
    // Return the updated data for admin functionality
    return res.status(200).json(req.body);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}