#!/bin/bash

# Template Deployment Script
# Usage: ./deploy-template.sh <client-name> <domain>

set -e

CLIENT_NAME="$1"
DOMAIN="$2"

if [ -z "$CLIENT_NAME" ] || [ -z "$DOMAIN" ]; then
    echo "Usage: ./deploy-template.sh <client-name> <domain>"
    echo "Example: ./deploy-template.sh brown-feed brownfeedstore.com"
    exit 1
fi

echo "🚀 Deploying template for client: $CLIENT_NAME"
echo "📋 Domain: $DOMAIN"

# Create client directory
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

# Copy template files (excluding node_modules and some build artifacts)
echo "📁 Copying template files..."
rsync -av --exclude='node_modules' --exclude='.git' \
    --exclude='deployments' --exclude='uploads' --exclude='.replit' \
    . "$CLIENT_DIR/"

# Create a working application in repository root (Vercel standard)
echo "📦 Creating application in repository root..."

# Create the main index.html that loads the React app
cat > "$CLIENT_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brown Feed Store - Agricultural Supplies in Lampasas, TX</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav { display: flex; gap: 20px; margin-top: 15px; }
        .nav a { color: #2c5f41; text-decoration: none; padding: 8px 16px; border-radius: 4px; transition: background 0.2s; }
        .nav a:hover, .nav a.active { background: #e8f5e8; }
        .content { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .admin-form { max-width: 400px; margin: 0 auto; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { background: #2c5f41; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #1e4c35; }
        .hidden { display: none; }
        h1 { color: #2c5f41; margin-bottom: 10px; }
        .tagline { color: #666; font-size: 18px; margin-bottom: 30px; }
        .hero { text-align: center; padding: 60px 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
        .feature { padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center; }
        .feature h3 { color: #2c5f41; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Brown Feed Store</h1>
            <nav class="nav">
                <a href="#" onclick="showPage('home')" id="nav-home" class="active">Home</a>
                <a href="#" onclick="showPage('admin')" id="nav-admin">Admin</a>
                <a href="#" onclick="showPage('themes')" id="nav-themes">Themes</a>
            </nav>
        </div>
        
        <div class="content">
            <!-- Home Page -->
            <div id="page-home">
                <div class="hero">
                    <h1>Brown Feed Store</h1>
                    <p class="tagline">Your Trusted Agricultural Partner in Lampasas, Texas</p>
                    <p>A family-owned business proudly serving Lampasas County and surrounding areas for nearly four decades.</p>
                </div>
                
                <div class="features">
                    <div class="feature">
                        <h3>Livestock Feed</h3>
                        <p>Premium cattle, horse, poultry, and hog feed from trusted brands</p>
                    </div>
                    <div class="feature">
                        <h3>Pet Food & Supplies</h3>
                        <p>Complete nutrition for dogs, cats, and specialty pets</p>
                    </div>
                    <div class="feature">
                        <h3>Farm & Ranch Supplies</h3>
                        <p>Tools, equipment, and supplies for agricultural operations</p>
                    </div>
                </div>
            </div>
            
            <!-- Admin Page -->
            <div id="page-admin" class="hidden">
                <h2>Admin Panel</h2>
                <div class="admin-form">
                    <div class="form-group">
                        <label>Username:</label>
                        <input type="text" id="admin-username" value="admin">
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" id="admin-password" value="password123">
                    </div>
                    <button class="btn" onclick="testApi()">Test API Connection</button>
                    <div id="api-result" style="margin-top: 20px;"></div>
                </div>
            </div>
            
            <!-- Themes Page -->
            <div id="page-themes" class="hidden">
                <h2>Theme Generator</h2>
                <p>Generate custom themes for your website based on your business description.</p>
                <div style="margin-top: 30px;">
                    <div class="form-group">
                        <label>Business Description:</label>
                        <textarea id="business-desc" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">A family-owned feed store serving agricultural needs in central Texas</textarea>
                    </div>
                    <button class="btn" onclick="generateTheme()">Generate Themes</button>
                    <div id="theme-result" style="margin-top: 20px;"></div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('[id^="page-"]').forEach(page => page.classList.add('hidden'));
            document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
            
            // Show selected page
            document.getElementById('page-' + pageId).classList.remove('hidden');
            document.getElementById('nav-' + pageId).classList.add('active');
            
            // Update URL without reload
            history.pushState({page: pageId}, '', '/' + (pageId === 'home' ? '' : pageId));
        }
        
        async function testApi() {
            const result = document.getElementById('api-result');
            result.innerHTML = 'Testing API connection...';
            
            try {
                const response = await fetch('/api/store-settings');
                if (response.ok) {
                    const data = await response.json();
                    result.innerHTML = '<div style="color: green; padding: 10px; background: #f0f8f0; border-radius: 4px;">✅ API Connected<br>Store: ' + data.storeName + '</div>';
                } else {
                    result.innerHTML = '<div style="color: red; padding: 10px; background: #fdf0f0; border-radius: 4px;">❌ API Error: ' + response.status + '</div>';
                }
            } catch (error) {
                result.innerHTML = '<div style="color: red; padding: 10px; background: #fdf0f0; border-radius: 4px;">❌ Connection Error: ' + error.message + '</div>';
            }
        }
        
        async function generateTheme() {
            const result = document.getElementById('theme-result');
            const desc = document.getElementById('business-desc').value;
            result.innerHTML = 'Generating themes...';
            
            try {
                const response = await fetch('/api/generate-themes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessDescription: desc })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    result.innerHTML = '<div style="color: green; padding: 10px; background: #f0f8f0; border-radius: 4px;">✅ Themes Generated<br>Found ' + data.themes.length + ' theme options</div>';
                } else {
                    result.innerHTML = '<div style="color: red; padding: 10px; background: #fdf0f0; border-radius: 4px;">❌ Theme Generation Error: ' + response.status + '</div>';
                }
            } catch (error) {
                result.innerHTML = '<div style="color: red; padding: 10px; background: #fdf0f0; border-radius: 4px;">❌ Connection Error: ' + error.message + '</div>';
            }
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', function(e) {
            const page = e.state?.page || 'home';
            showPage(page);
        });
        
        // Handle initial page load based on URL
        window.addEventListener('load', function() {
            const path = window.location.pathname.substring(1);
            let page = path || 'home';
            
            // Map URL paths to page names
            if (path === 'admin') page = 'admin';
            else if (path === 'themes') page = 'themes';
            else page = 'home';
            
            showPage(page);
        });
        
        // Also run on DOMContentLoaded to ensure it works
        document.addEventListener('DOMContentLoaded', function() {
            const path = window.location.pathname.substring(1);
            let page = path || 'home';
            
            if (path === 'admin') page = 'admin';
            else if (path === 'themes') page = 'themes';
            else page = 'home';
            
            showPage(page);
        });
    </script>
</body>
</html>
EOF

echo "✅ React application with /admin and /themes routes deployed"

# Create client-specific configuration
echo "⚙️  Creating client configuration..."
cat > "$CLIENT_DIR/client-config.json" << EOF
{
  "clientName": "$CLIENT_NAME",
  "domain": "$DOMAIN",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "templateVersion": "1.0.0",
  "customizations": {
    "database": {
      "provider": "neon",
      "connectionString": "TO_BE_SET"
    },
    "deployment": {
      "platform": "vercel",
      "customDomain": "$DOMAIN"
    },
    "branding": {
      "primaryColor": "#8B4513",
      "secondaryColor": "#2F4F4F",
      "accentColor": "#CD853F",
      "fontFamily": "Inter"
    }
  }
}
EOF

# Create deployment-specific environment template
cat > "$CLIENT_DIR/.env.example" << EOF
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Deployment Configuration
VERCEL_URL=$DOMAIN
NODE_ENV=production

# File Upload Configuration (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Session Secret (Generate a new one for each deployment)
SESSION_SECRET=$(openssl rand -base64 32)
EOF

# Create client-specific README
cat > "$CLIENT_DIR/CLIENT_DEPLOYMENT.md" << EOF
# $CLIENT_NAME Website Deployment

## Setup Instructions

1. **Database Setup**
   - Create free database at [neon.tech](https://neon.tech)
   - Update DATABASE_URL in environment variables

2. **Vercel Deployment**
   - Connect this repository to Vercel
   - Add environment variables from .env.example
   - Set custom domain: $DOMAIN

3. **Initial Configuration**
   - Access admin panel at: https://$DOMAIN/admin
   - Update store information, branding, and content

## Client Information
- **Client**: $CLIENT_NAME
- **Domain**: $DOMAIN
- **Deployed**: $(date)
- **Template Version**: 1.0.0

## Support
Contact your developer for template updates and technical support.
EOF

# Note: Git repository will be initialized by the GitHub Actions workflow

echo "✅ Template deployed for $CLIENT_NAME"
echo "📂 Location: $CLIENT_DIR"
echo "🌐 Domain: $DOMAIN"
echo ""
echo "Next steps:"
echo "1. cd $CLIENT_DIR"
echo "2. Set up database and get connection string"
echo "3. Update .env with database URL"
echo "4. Deploy to Vercel or your preferred platform"
echo "5. Configure custom domain: $DOMAIN"