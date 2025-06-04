export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const categories = [
      {
        id: 1,
        title: "Livestock Feed",
        description: "Complete nutrition for cattle, horses, goats, sheep, and swine",
        imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        iconName: "Wheat",
        items: ["Cattle Feed & Supplements", "Horse Feed & Hay", "Goat & Sheep Feed", "Swine Feed", "Range Cubes & Mineral Blocks"],
        displayOrder: 1
      },
      {
        id: 2,
        title: "Pet Food & Supplies",
        description: "Premium nutrition and supplies for dogs, cats, and small animals",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        iconName: "Dog",
        items: ["Premium Dog Food", "Cat Food & Treats", "Pet Toys & Accessories", "Leashes & Collars", "Pet Health Supplements"],
        displayOrder: 2
      },
      {
        id: 3,
        title: "Farm Equipment & Tools",
        description: "Essential tools and equipment for farm operations",
        imageUrl: "https://images.unsplash.com/photo-1574263867128-73b8bdb2c7ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        iconName: "Wrench",
        items: ["Hand Tools", "Water Systems", "Fencing Supplies", "Safety Equipment", "Maintenance Tools"],
        displayOrder: 3
      }
    ];
    
    return res.status(200).json(categories);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}