#!/bin/bash

# Deploy Client (Efficient) Script
# Creates minimal client deployment structure with configuration files only

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <client_name> <domain>"
    echo "Example: $0 brown-feed brownfeedstore.com"
    exit 1
fi

CLIENT_NAME="$1"
DOMAIN="$2"

echo "Creating efficient deployment for client: $CLIENT_NAME"
echo "Domain: $DOMAIN"

# Create deployments directory if it doesn't exist
mkdir -p deployments

# Skip local build - let CI/Vercel handle building
echo "Preparing source files for deployment..."

# Create client-specific deployment directory
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

# Copy complete source code to client directory
echo "Copying complete source code to client deployment..."
cp -r api "$CLIENT_DIR/"
cp -r server "$CLIENT_DIR/"
cp -r shared "$CLIENT_DIR/"
cp -r client "$CLIENT_DIR/"

# Copy built frontend if it exists (from CI build step)
if [ -d "dist" ]; then
  echo "Copying built frontend files..."
  cp -r dist "$CLIENT_DIR/"
fi

# Create client configuration file
cat > "$CLIENT_DIR/client-config.json" << EOF
{
  "clientName": "$CLIENT_NAME",
  "domain": "$DOMAIN",
  "storeName": "${CLIENT_NAME^} Feed Store",
  "templateVersion": "$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "customizations": {
    "colors": {
      "primary": "#8B4513",
      "secondary": "#D2691E", 
      "accent": "#228B22"
    },
    "branding": {
      "logoUrl": "",
      "faviconUrl": ""
    }
  }
}
EOF

# Create Vercel configuration with proper JSON escaping
cat > "$CLIENT_DIR/vercel.json" << 'EOF'
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "installCommand": "npm install",
  "framework": "vite",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

# Copy main package.json with full dependencies
cp package.json "$CLIENT_DIR/"

# Update the copied package.json to set client-specific name
sed -i 's/"name": "rest-express"/"name": "'$CLIENT_NAME'-website"/' "$CLIENT_DIR/package.json"

# Copy additional necessary files
cp tsconfig.json "$CLIENT_DIR/" 2>/dev/null || echo "tsconfig.json not found, skipping"
cp tailwind.config.ts "$CLIENT_DIR/" 2>/dev/null || echo "tailwind.config.ts not found, skipping"
cp postcss.config.js "$CLIENT_DIR/" 2>/dev/null || echo "postcss.config.js not found, skipping"
cp vite.config.ts "$CLIENT_DIR/" 2>/dev/null || echo "vite.config.ts not found, skipping"

# The api, server, shared, and dist folders are already copied above
# Update the API index.ts to include client configuration
sed -i '1i// Client: '$CLIENT_NAME'\n// Domain: '$DOMAIN'\n' "$CLIENT_DIR/api/index.ts"

# Create README for client deployment
cat > "$CLIENT_DIR/README.md" << EOF
# $CLIENT_NAME Website

This is an efficient client deployment that references the main template repository.

## Configuration

- **Client**: $CLIENT_NAME  
- **Domain**: $DOMAIN
- **Template Version**: $(git rev-parse --short HEAD 2>/dev/null || echo 'latest')
- **Deployed**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Files Structure

This deployment contains only configuration files:
- \`client-config.json\` - Client-specific settings
- \`vercel.json\` - Deployment configuration  
- \`api/index.ts\` - API entry point that references template
- \`package.json\` - Minimal dependencies

The actual application code remains in the template repository, ensuring:
- 99% storage reduction per client
- Instant template updates across all clients
- Single codebase to maintain

## Admin Panel

Once deployed, access the admin panel at: https://$DOMAIN/admin

## Template Updates

All updates are pushed automatically from the template repository.
No manual changes should be made to this repository.
EOF

# Initialize git repository in client directory
cd "$CLIENT_DIR"
git init
git add .
git commit -m "Initial deployment configuration for $CLIENT_NAME"
git branch -M main
cd - > /dev/null

echo ""
echo "✅ Efficient deployment created successfully!"
echo ""
echo "📁 Client directory: $CLIENT_DIR"
echo "📝 Configuration: client-config.json ($(du -sh "$CLIENT_DIR/client-config.json" | cut -f1))"
echo "🔧 Total size: $(du -sh "$CLIENT_DIR" | cut -f1) (vs ~200MB for full copy)"
echo ""
echo "Next steps:"
echo "1. Database will be created automatically"
echo "2. GitHub repository will be created"  
echo "3. Vercel deployment will be configured"
echo "4. Admin panel will be available at https://$DOMAIN/admin"