export default function handler(req: any, res: any) {
  // Simple health check
  if (req.url === '/api/health') {
    return res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      client: process.env.CLIENT_NAME || 'unknown'
    });
  }
  
  // Serve basic HTML for all other routes
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Brown Feed Store - Lampasas, TX</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <h1>Brown Feed Store</h1>
      <p>Located in Lampasas, Texas</p>
      <p>Your local feed and farm supply store</p>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}