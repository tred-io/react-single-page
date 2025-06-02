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

# Deploy the built React application if available, otherwise create fallback
if [ -f "dist/index.html" ]; then
    echo "📦 Deploying built React application..."
    mkdir -p "$CLIENT_DIR/dist/public"
    cp -r dist/* "$CLIENT_DIR/dist/public/"
    echo "✅ Full React application deployed with routing support"
else
    echo "📦 Creating fallback index.html in dist/public/..."
    mkdir -p "$CLIENT_DIR/dist/public"
    cat > "$CLIENT_DIR/dist/public/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brown Feed Store - Agricultural Supplies in Lampasas, TX</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
        h1 { color: #2c5f41; margin-bottom: 10px; }
        .tagline { color: #666; font-size: 18px; margin-bottom: 30px; }
        .loading { text-align: center; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Brown Feed Store</h1>
        <p class="tagline">Your Trusted Agricultural Partner in Lampasas, Texas</p>
        <div class="loading">
            <p>Site is loading... Please check back soon.</p>
            <p>The full application with admin and theme features will be available once the build completes.</p>
        </div>
    </div>
</body>
</html>
EOF
    echo "⚠️  Fallback page deployed - admin and themes routes unavailable"
fi

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