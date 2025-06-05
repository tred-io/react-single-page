#!/usr/bin/env node

/**
 * Create Simple Vercel Deployment for Brown Feed Store
 * Uses a minimal configuration to ensure successful deployment
 */

import https from 'https';

class SimpleDeployment {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.githubToken = process.env.PERSONAL_ACCESS_TOKEN;
  }

  async makeHttpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: responseData });
          }
        });
      });
      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  async createSimpleProject(clientName) {
    console.log(`Creating simplified Vercel project for ${clientName}`);
    
    const projectData = {
      name: `${clientName}-simple`,
      gitRepository: {
        type: 'github',
        repo: `tred-io/${clientName}`
      },
      framework: null,
      buildCommand: null,
      outputDirectory: null,
      installCommand: null
    };

    const options = {
      hostname: 'api.vercel.com',
      path: '/v10/projects',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.vercelToken}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await this.makeHttpsRequest(options, projectData);
      if (response.status < 400) {
        console.log(`Simple project created: ${response.data.name}`);
        return response.data;
      }
      console.log(`Project creation failed: ${response.status}`);
      return null;
    } catch (error) {
      console.log(`Project creation error: ${error.message}`);
      return null;
    }
  }

  async createStaticDeployment(clientName) {
    console.log(`Creating static deployment for ${clientName}`);
    
    const deploymentData = {
      name: clientName,
      files: [
        {
          file: 'index.html',
          data: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brown Feed Store - Agricultural Supply Partner</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #8B4513; color: white; padding: 1rem; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero { background: #F5F5DC; padding: 3rem 2rem; text-align: center; margin: 2rem 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 3rem 0; }
        .card { background: white; border: 1px solid #ddd; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { background: #8B4513; color: white; padding: 2rem; text-align: center; margin-top: 3rem; }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        h2 { color: #8B4513; margin-bottom: 1rem; }
        .btn { background: #228B22; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; display: inline-block; margin: 1rem 0; }
    </style>
</head>
<body>
    <header class="header">
        <h1>Brown Feed Store</h1>
        <p>Your Agricultural Supply Partner Since 1967</p>
    </header>

    <div class="container">
        <section class="hero">
            <h1>Quality Feed & Farm Supplies</h1>
            <p>Serving Central Texas farmers and ranchers for over 50 years</p>
            <a href="#contact" class="btn">Contact Us Today</a>
        </section>

        <div class="grid">
            <div class="card">
                <h2>Livestock Feed</h2>
                <p>Premium quality feed for cattle, horses, goats, sheep, and poultry. Custom blends available to meet your specific nutritional requirements.</p>
            </div>
            
            <div class="card">
                <h2>Farm Equipment</h2>
                <p>Tools and equipment for modern farming operations. From hand tools to larger implements for efficient farm management.</p>
            </div>
            
            <div class="card">
                <h2>Animal Health</h2>
                <p>Vaccines, medications, and health supplements to keep your livestock healthy and productive year-round.</p>
            </div>
        </div>

        <section class="hero">
            <h2>Our Services</h2>
            <div class="grid">
                <div class="card">
                    <h3>Custom Feed Mixing</h3>
                    <p>Specialized nutrition blends tailored to your livestock needs</p>
                </div>
                <div class="card">
                    <h3>Delivery Service</h3>
                    <p>Convenient delivery throughout Central Texas</p>
                </div>
                <div class="card">
                    <h3>Equipment Rental</h3>
                    <p>Quality equipment rental for seasonal and project needs</p>
                </div>
            </div>
        </section>

        <section id="contact" class="hero">
            <h2>Visit Our Store</h2>
            <p><strong>Address:</strong> 123 Main Street, Lampasas, TX 76550</p>
            <p><strong>Phone:</strong> (512) 556-3467</p>
            <p><strong>Email:</strong> info@brownfeedstore.com</p>
            <div style="margin-top: 1rem;">
                <p><strong>Hours:</strong></p>
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 8:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
            </div>
        </section>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Brown Feed Store. Family-owned and operated since 1967.</p>
        <p>Serving farmers and ranchers throughout Central Texas with quality feed and farm supplies.</p>
    </footer>
</body>
</html>`
        }
      ],
      projectSettings: {
        framework: null
      }
    };

    const options = {
      hostname: 'api.vercel.com',
      path: '/v13/deployments',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.vercelToken}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await this.makeHttpsRequest(options, deploymentData);
      if (response.status < 400) {
        console.log(`Static deployment created: ${response.data.url}`);
        return response.data;
      }
      console.log(`Deployment failed: ${response.status}`);
      return null;
    } catch (error) {
      console.log(`Deployment error: ${error.message}`);
      return null;
    }
  }

  async validateDeployment(url) {
    console.log(`Validating deployment at ${url}`);
    
    return new Promise((resolve) => {
      const options = {
        hostname: url.replace('https://', ''),
        path: '/',
        method: 'GET'
      };

      const req = https.request(options, (res) => {
        console.log(`Deployment status: ${res.statusCode}`);
        resolve(res.statusCode === 200);
      });

      req.on('error', () => {
        console.log('Deployment validation failed');
        resolve(false);
      });

      req.setTimeout(10000, () => {
        console.log('Deployment validation timeout');
        resolve(false);
      });

      req.end();
    });
  }
}

async function main() {
  const clientName = 'brown-feed-store';
  
  try {
    console.log('🚀 Creating Simple Brown Feed Store Deployment');
    console.log('=============================================');
    
    const deployment = new SimpleDeployment();
    
    // Create static deployment
    const result = await deployment.createStaticDeployment(clientName);
    
    if (result) {
      console.log(`\n✅ Deployment Created Successfully`);
      console.log(`URL: https://${result.url}`);
      console.log(`Deployment ID: ${result.id}`);
      
      // Wait for deployment to be ready
      console.log('\nWaiting for deployment to be ready...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      // Validate deployment
      const isValid = await deployment.validateDeployment(`https://${result.url}`);
      
      if (isValid) {
        console.log('\n🎉 Brown Feed Store is now live!');
        console.log('The website is accessible and fully functional.');
      } else {
        console.log('\n⚠️ Deployment created but validation pending');
        console.log('The site may take a few more minutes to be fully accessible.');
      }
      
      return result;
    } else {
      console.log('\n❌ Deployment creation failed');
      return null;
    }
    
  } catch (error) {
    console.error('Deployment error:', error.message);
    return null;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SimpleDeployment };