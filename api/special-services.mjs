export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const services = [
      {
        id: 1,
        title: "Expert Consultation",
        description: "Get personalized advice from our experienced team on nutrition and animal care",
        iconName: "Users",
        displayOrder: 1
      },
      {
        id: 2,
        title: "Feed Delivery",
        description: "Convenient delivery service for bulk orders throughout Lampasas County",
        iconName: "Truck",
        displayOrder: 2
      },
      {
        id: 3,
        title: "Custom Feed Mixing",
        description: "Specialized feed blends tailored to your livestock's specific needs",
        iconName: "Settings",
        displayOrder: 3
      }
    ];
    
    return res.status(200).json(services);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}