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

# Create client-specific deployment directory
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

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

# Create Vercel configuration
cat > "$CLIENT_DIR/vercel.json" << EOF
{
  "version": 2,
  "name": "$CLIENT_NAME-website",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/\$1"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "CLIENT_NAME": "$CLIENT_NAME",
    "CLIENT_CONFIG_PATH": "./client-config.json"
  }
}
EOF

# Create package.json for client
cat > "$CLIENT_DIR/package.json" << EOF
{
  "name": "$CLIENT_NAME-website",
  "version": "1.0.0",
  "description": "Website for $CLIENT_NAME",
  "main": "api/index.ts",
  "scripts": {
    "build": "echo 'Using template build system'",
    "start": "node api/index.ts",
    "dev": "echo 'Development mode not available for client deployments'"
  },
  "dependencies": {
    "@vercel/node": "^3.0.0"
  },
  "engines": {
    "node": ">=18"
  }
}
EOF

# Create directory for API first
mkdir -p "$CLIENT_DIR/api"

# Create minimal API entry point that references the template
cat > "$CLIENT_DIR/api/index.ts" << EOF
// Client API Entry Point
// This file references the main template and loads client-specific configuration

import { resolve } from 'path';

// Set client configuration path for the template
process.env.CLIENT_CONFIG_PATH = resolve(__dirname, '../client-config.json');
process.env.CLIENT_NAME = '$CLIENT_NAME';

// Import and export the main template handler
export { default } from '../../../api/index';
EOF

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