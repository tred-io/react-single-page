export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const brands = [
      {
        id: 1,
        name: "Purina",
        logoUrl: "https://www.purina.com/sites/default/files/2021-02/Purina-Logo_0.png",
        displayOrder: 1
      },
      {
        id: 2,
        name: "Nutrena",
        logoUrl: "https://www.nutrenaworld.com/themes/custom/nutrena/images/nutrena-logo.png",
        displayOrder: 2
      },
      {
        id: 3,
        name: "Producer's Pride",
        logoUrl: "https://www.tractorsupply.com/brand/producers-pride",
        displayOrder: 3
      }
    ];
    
    return res.status(200).json(brands);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}