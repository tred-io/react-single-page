#!/usr/bin/env node

/**
 * Create Static Vercel Deployment for Brown Feed Store
 * Bypasses Vite build issues by creating a pure HTML/CSS/JS deployment
 */

import https from 'https';
import { readFileSync } from 'fs';

class StaticVercelDeployer {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.orgId = 'tred-io';
  }

  async createStaticProject() {
    const projectData = {
      name: 'brown-feed-store-static',
      framework: null,
      gitRepository: {
        type: 'github',
        repo: 'tred-io/brown-feed-store'
      },
      buildCommand: null,
      outputDirectory: null,
      installCommand: null,
      devCommand: null,
      environmentVariables: []
    };

    return this.makeRequest('POST', '/v10/projects', projectData);
  }

  async deployStatic() {
    console.log('🚀 Creating Static Brown Feed Store Deployment');
    console.log('===============================================');

    try {
      // Create simple HTML file
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brown Feed Store - Your Agricultural Supply Partner Since 1967</title>
    <meta name="description" content="Brown Feed Store has been serving Central Texas farmers and ranchers since 1967. Quality feed, farm supplies, and agricultural services in Lampasas, TX.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: #8B4513; color: white; padding: 1rem 0; }
        .nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: bold; }
        .hero { background: linear-gradient(rgba(139,69,19,0.8), rgba(139,69,19,0.8)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23228B22" width="1200" height="600"/><path fill="%23654321" d="M0 400 Q300 350 600 400 Q900 450 1200 400 V600 H0 Z"/></svg>'); 
                 background-size: cover; color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { background: #CD853F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .section { padding: 4rem 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .about { background: #f8f8f8; }
        footer { background: #333; color: white; padding: 2rem 0; text-align: center; }
        .contact-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        @media (max-width: 768px) { 
            .hero h1 { font-size: 2rem; } 
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav class="nav">
                <div class="logo">Brown Feed Store</div>
                <div>📞 (512) 556-3467</div>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Quality Feed & Farm Supplies</h1>
            <p>Serving Central Texas farmers and ranchers for over 50 years</p>
            <a href="#contact" class="btn">Visit Our Store</a>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">Our Products & Services</h2>
            <div class="grid">
                <div class="card">
                    <h3>🌾 Livestock Feed</h3>
                    <p>Premium feed for cattle, horses, poultry, and small animals. Custom blends available for specific nutritional needs.</p>
                </div>
                <div class="card">
                    <h3>🚜 Farm Supplies</h3>
                    <p>Tools, equipment, and supplies for modern farming operations. From hand tools to large equipment parts.</p>
                </div>
                <div class="card">
                    <h3>🌱 Seeds & Fertilizers</h3>
                    <p>High-quality seeds for crops and pastures, plus fertilizers and soil amendments for optimal growth.</p>
                </div>
                <div class="card">
                    <h3>🐎 Custom Feed Mixing</h3>
                    <p>Our expert nutritionists create custom feed blends tailored to your livestock's specific dietary requirements.</p>
                </div>
                <div class="card">
                    <h3>🚚 Delivery Services</h3>
                    <p>Convenient delivery throughout Central Texas. Schedule regular deliveries for your farm's ongoing needs.</p>
                </div>
                <div class="card">
                    <h3>💡 Agricultural Consulting</h3>
                    <p>Expert advice on nutrition, farming practices, and equipment selection from our experienced team.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section about">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem;">About Brown Feed Store</h2>
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.1rem; margin-bottom: 2rem;">
                    Family-owned and operated since 1967, Brown Feed Store has been the trusted partner for farmers 
                    and ranchers throughout Central Texas. We provide high-quality feed, farm supplies, and expert 
                    advice to help your agricultural operation thrive.
                </p>
                <p>
                    <strong>Founded:</strong> 1967 | <strong>Location:</strong> Lampasas, TX | <strong>Specialty:</strong> Agricultural Supplies
                </p>
            </div>
        </div>
    </section>

    <section class="section" id="contact">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">Visit Our Store</h2>
            <div class="contact-info">
                <div class="card">
                    <h3>📍 Location</h3>
                    <p>123 Main Street<br>Lampasas, TX 76550</p>
                </div>
                <div class="card">
                    <h3>📞 Contact</h3>
                    <p>Phone: (512) 556-3467<br>Email: info@brownfeedstore.com</p>
                </div>
                <div class="card">
                    <h3>🕒 Hours</h3>
                    <p>Mon-Fri: 8:00 AM - 6:00 PM<br>Saturday: 8:00 AM - 5:00 PM<br>Sunday: Closed</p>
                </div>
                <div class="card">
                    <h3>🌐 Connect</h3>
                    <p>
                        <a href="#" style="color: #8B4513;">Facebook</a> | 
                        <a href="#" style="color: #8B4513;">Instagram</a> | 
                        <a href="#" style="color: #8B4513;">Google Reviews</a>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 Brown Feed Store. All rights reserved. | Serving Central Texas Since 1967</p>
            <p style="margin-top: 1rem;">Quality Feed • Farm Supplies • Expert Service</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;

      // Create files for deployment
      const files = [
        { file: 'index.html', data: htmlContent }
      ];

      const deploymentData = {
        name: 'brown-feed-store-static',
        files: files,
        projectSettings: {
          framework: null,
          buildCommand: null,
          outputDirectory: null
        }
      };

      const deployment = await this.makeRequest('POST', '/v13/deployments', deploymentData);
      
      if (deployment.url) {
        console.log(`✅ Static deployment created: ${deployment.url}`);
        console.log(`🌐 Access URL: https://${deployment.url}`);
        return deployment;
      } else {
        console.log('❌ Deployment failed:', deployment);
        return null;
      }

    } catch (error) {
      console.error('Static deployment error:', error.message);
      return null;
    }
  }

  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path: path,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            resolve({ error: responseData, status: res.statusCode });
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
}

async function main() {
  const deployer = new StaticVercelDeployer();
  await deployer.deployStatic();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}