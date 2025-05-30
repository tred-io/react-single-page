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

# Copy template files (excluding node_modules and build artifacts)
echo "📁 Copying template files..."
mkdir -p "$CLIENT_DIR"
cp -r . "$CLIENT_DIR/" 2>/dev/null || true
rm -rf "$CLIENT_DIR/node_modules" "$CLIENT_DIR/dist" "$CLIENT_DIR/.git" \
       "$CLIENT_DIR/deployments" "$CLIENT_DIR/uploads" 2>/dev/null || true

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

# Initialize git repository for client
cd "$CLIENT_DIR"
git init
git add .
git commit -m "Initial deployment for $CLIENT_NAME - Template v1.0.0"

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