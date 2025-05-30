# Business Website Template Management System

## Overview
This template system allows you to deploy the same business website codebase to multiple clients while maintaining individual customizations and easy updates.

## Directory Structure
```
business-website-template/          (Master template)
├── deployments/                    (Client deployments)
│   ├── client-a/                  (Individual client site)
│   ├── client-b/                  (Individual client site)
│   └── client-c/                  (Individual client site)
├── template-config.json           (Template metadata)
├── deploy-template.sh             (Deploy to new client)
├── update-clients.sh              (Update existing clients)
└── VERCEL_DEPLOYMENT_GUIDE.md     (Deployment instructions)
```

## Quick Start

### Deploy to New Client
```bash
chmod +x deploy-template.sh
./deploy-template.sh brown-feed brownfeedstore.com
```

### Update All Existing Clients
```bash
chmod +x update-clients.sh
./update-clients.sh all
```

### Update Specific Client
```bash
./update-clients.sh brown-feed
```

## Workflow for Multiple Clients

### 1. Initial Client Setup
```bash
# Deploy template for new client
./deploy-template.sh acme-hardware acmehardware.com

# Navigate to client directory
cd deployments/acme-hardware

# Set up database (Neon, Supabase, etc.)
# Update .env with DATABASE_URL

# Deploy to Vercel
git remote add origin https://github.com/yourusername/acme-hardware-site.git
git push -u origin main
```

### 2. Client Customization
Each client gets their own:
- Database with unique content
- Color scheme and branding
- Logo and images
- Domain name
- Custom features (if needed)

### 3. Template Updates
When you improve the master template:
```bash
# Make changes to master template
git add .
git commit -m "Add new feature: contact form"

# Update all client sites
./update-clients.sh all

# Or update specific client
./update-clients.sh acme-hardware
```

## Client Configuration

Each client deployment includes:

### `client-config.json`
```json
{
  "clientName": "brown-feed",
  "domain": "brownfeedstore.com",
  "templateVersion": "1.0.0",
  "customizations": {
    "database": {
      "provider": "neon",
      "connectionString": "postgresql://..."
    },
    "branding": {
      "primaryColor": "#8B4513",
      "secondaryColor": "#2F4F4F"
    }
  }
}
```

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
VERCEL_URL=brownfeedstore.com
SESSION_SECRET=generated-secret
```

## Best Practices

### Template Updates
1. **Test first** - Always test changes in master template
2. **Update gradually** - Deploy to one client first, then others
3. **Backup customizations** - Script automatically preserves client configs
4. **Version control** - Each update creates a git commit

### Client Management
1. **Separate repositories** - Each client gets their own GitHub repo
2. **Independent deployments** - Each client deploys independently
3. **Custom domains** - Each client uses their own domain
4. **Isolated databases** - Each client has separate database

### Customization Strategy
- **Template level** - Features all clients will use
- **Client level** - Branding, content, specific customizations
- **Feature flags** - Enable/disable features per client

## Common Use Cases

### Adding New Feature to Template
```bash
# Add feature to master template
git add .
git commit -m "Add newsletter signup feature"

# Update all clients to get new feature
./update-clients.sh all
```

### Client-Specific Customization
```bash
cd deployments/acme-hardware
# Make client-specific changes
git add .
git commit -m "Add custom inventory page for Acme"
git push
```

### Emergency Fix
```bash
# Fix critical bug in master template
git add .
git commit -m "Fix security vulnerability"

# Immediately update all clients
./update-clients.sh all
```

## Deployment Platforms

### Vercel (Recommended)
- Free tier available
- Automatic deployments from Git
- Custom domain support
- Built-in environment variables

### Alternative Platforms
- Netlify
- Railway
- Render
- Your own VPS

## Database Options

### Free Tier Options
- **Neon**: 512MB, PostgreSQL
- **Supabase**: 500MB, PostgreSQL + auth
- **PlanetScale**: 1GB, MySQL

## Support and Maintenance

### For Template Updates
1. Update master template
2. Test changes
3. Run update script for clients
4. Monitor deployments

### For Client Support
1. Navigate to client directory
2. Make client-specific changes
3. Deploy to their domain
4. Document customizations

This system gives you the flexibility to maintain multiple client sites while keeping them updated with your latest improvements.