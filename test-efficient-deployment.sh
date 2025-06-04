#!/bin/bash

# Test Efficient Deployment Script
# Creates 5KB client configurations instead of 200MB copies

CLIENT_NAME="${1:-brown-feed-test}"
DOMAIN="${2:-brown-feed-test.vercel.app}"

echo "🚀 Testing Efficient Deployment System"
echo "Client: $CLIENT_NAME"
echo "Domain: $DOMAIN"
echo ""

# Create efficient deployment structure
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

# Create client-specific configuration (5KB instead of 200MB)
cat > "$CLIENT_DIR/client-config.json" << EOF
{
  "clientName": "$CLIENT_NAME",
  "domain": "$DOMAIN",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "templateVersion": "1.0.0"
}
EOF

# Create efficient Vercel configuration that points to template root
cat > "$CLIENT_DIR/vercel.json" << 'EOF'
{
  "buildCommand": "cd ../../.. && npm run build",
  "outputDirectory": "../../../dist",
  "installCommand": "cd ../../.. && npm install",
  "functions": {
    "../../../api/index.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/admin",
      "destination": "/index.html"
    },
    {
      "source": "/themes", 
      "destination": "/index.html"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

# Create minimal package.json that references shared template
cat > "$CLIENT_DIR/package.json" << 'EOF'
{
  "name": "client-deployment",
  "version": "1.0.0",
  "scripts": {
    "build": "cd ../../.. && npm run build",
    "dev": "cd ../../.. && npm run dev"
  }
}
EOF

# Create environment file with shared database
cat > "$CLIENT_DIR/.env" << EOF
DATABASE_URL=$DATABASE_URL
CLIENT_CONFIG_PATH=./client-config.json
CLIENT_NAME=$CLIENT_NAME
DOMAIN=$DOMAIN
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

cd "$CLIENT_DIR"

# Initialize git repository
git init
git add .
git config user.email "actions@github.com"
git config user.name "GitHub Actions"
git commit -m "Initial efficient deployment for $CLIENT_NAME"

# Show deployment size
CLIENT_SIZE=$(du -sh . | cut -f1)
echo "✅ Efficient deployment created: $CLIENT_SIZE"
echo ""
echo "Deployment structure:"
ls -la
echo ""
echo "Client config:"
cat client-config.json
echo ""
echo "Ready for GitHub repository creation and Vercel deployment"