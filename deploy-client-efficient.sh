#!/bin/bash

# Efficient Client Deployment Script
# Creates minimal client-specific configuration instead of duplicating entire codebase

set -e

CLIENT_NAME="$1"
DOMAIN="$2"

if [ -z "$CLIENT_NAME" ] || [ -z "$DOMAIN" ]; then
    echo "Usage: ./deploy-client-efficient.sh <client-name> <domain>"
    echo "Example: ./deploy-client-efficient.sh brown-feed brownfeedstore.com"
    exit 1
fi

echo "🚀 Creating efficient deployment for client: $CLIENT_NAME"
echo "📋 Domain: $DOMAIN"

# Create minimal client directory with only configuration
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

# Create client-specific package.json that references template
cat > "$CLIENT_DIR/package.json" << EOF
{
  "name": "${CLIENT_NAME}-website",
  "version": "1.0.0",
  "description": "Website for ${CLIENT_NAME}",
  "scripts": {
    "dev": "node ../../../server/index.ts",
    "build": "npm run --prefix ../../.. build",
    "start": "npm run --prefix ../../.. start",
    "db:push": "npm run --prefix ../../.. db:push"
  },
  "dependencies": {
    "template": "file:../../.."
  }
}
EOF

# Create client-specific configuration
cat > "$CLIENT_DIR/client-config.json" << EOF
{
  "clientName": "$CLIENT_NAME",
  "domain": "$DOMAIN",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "templateVersion": "1.0.0",
  "templatePath": "../../..",
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
EOF

# Create environment configuration
cat > "$CLIENT_DIR/.env.example" << EOF
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Client Configuration
CLIENT_CONFIG_PATH=./client-config.json
TEMPLATE_PATH=../../..

# Deployment Configuration
VERCEL_URL=$DOMAIN
NODE_ENV=production

# Session Secret (Generate a new one for each deployment)
SESSION_SECRET=$(openssl rand -base64 32)
EOF

# Create Vercel configuration that points to template
cat > "$CLIENT_DIR/vercel.json" << EOF
{
  "buildCommand": "cd ../../.. && npm run build",
  "outputDirectory": "../../../dist",
  "installCommand": "cd ../../.. && npm install",
  "framework": null,
  "env": {
    "CLIENT_CONFIG_PATH": "./deployments/$CLIENT_NAME/client-config.json"
  }
}
EOF

# Create minimal README with deployment instructions
cat > "$CLIENT_DIR/README.md" << EOF
# $CLIENT_NAME Website

This is a lightweight deployment configuration for $CLIENT_NAME that references the shared template codebase.

## Structure
- **Template code**: Located at \`../../..\` (shared across all clients)
- **Client config**: \`client-config.json\` (unique to this client)
- **Environment**: \`.env\` (client-specific settings)

## Deployment
This configuration uses the shared template codebase to minimize storage and maintenance overhead.

**Domain**: $DOMAIN
**Deployed**: $(date)
**Template Version**: 1.0.0

## Development
\`\`\`bash
# Install dependencies (in template root)
cd ../../..
npm install

# Start development server for this client
cd deployments/$CLIENT_NAME
npm run dev
\`\`\`

## Production Deployment
The Vercel configuration points to the shared template build, with client-specific environment variables.
EOF

# Note: Git repository will be initialized by the GitHub Actions workflow

echo "✅ Efficient deployment created for $CLIENT_NAME"
echo "📂 Location: $CLIENT_DIR ($(du -sh $CLIENT_DIR | cut -f1) vs full copy: ~200MB)"
echo "🌐 Domain: $DOMAIN"
echo ""
echo "Files created:"
echo "- client-config.json (client-specific settings)"
echo "- .env.example (environment template)"
echo "- vercel.json (deployment configuration)"
echo "- package.json (references shared template)"
echo "- README.md (deployment instructions)"
echo ""
echo "Template codebase remains at: ../../.. (shared across all clients)"