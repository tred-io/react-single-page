# Brown Feed Store Website Template

A professional business website template with automated deployment system designed for agricultural supply stores and similar businesses. Features efficient client management, automated database provisioning, and safe deployment practices.

## Quick Start

### For Website Owners
1. Visit your admin panel at `/admin`
2. Update store information, hours, and contact details
3. Upload your logo and images
4. Customize product categories and services
5. Your website updates automatically

### For Developers/Agencies

**Deploy a New Client (5 minutes, fully automated):**
```bash
# Run the deployment script
./deploy-client-efficient.sh client-name client-domain.com

# Or use GitHub Actions for complete automation including database setup
```

**Update All Client Sites:**
```bash
# Safe canary deployment to 20% of clients first
./update-clients-efficient.sh
```

## System Overview

### Storage Efficiency
- **Traditional approach**: 200MB+ per client
- **This system**: 148KB per client (99.9% reduction)
- **At scale**: 1,000 clients = 150MB vs 200GB

### Safety Features
- Canary deployments test on small group first
- Health monitoring during rollouts
- Automatic rollback if issues detected
- Zero downtime updates

### Automation
- Database automatically created and configured
- GitHub repository generated
- Deployed with custom domain
- Admin panel ready immediately

## Complete Setup Guide

### 1. API Keys Required

**Database Provider (choose one):**
- **Neon** (recommended): Get API key from neon.tech
- **Supabase**: Get access token from supabase.com  
- **PlanetScale**: Get service token from planetscale.com

**GitHub Integration:**
- Personal access token with repo and workflow permissions

**Deployment Platform:**
- Vercel token and organization ID

### 2. GitHub Secrets Configuration

Add these secrets in your repository settings:

```
NEON_API_KEY=your_neon_api_key
PERSONAL_ACCESS_TOKEN=your_github_token  
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
```

### 3. Deploy Your First Client

**Using GitHub Actions:**
1. Go to Actions → Complete Deployment Pipeline
2. Select "deploy-new-client" 
3. Enter client name and domain
4. Click "Run workflow"

**Using Command Line:**
```bash
./deploy-client-efficient.sh texasfeed texasfeedstore.com
```

### 4. Update Template (All Clients)

**Safe Canary Deployment:**
1. Make changes to your template
2. Go to Actions → Complete Deployment Pipeline  
3. Select "update-template"
4. Choose "canary" strategy
5. System deploys to 20% first, monitors health, then deploys to all

### 5. Emergency Rollback

If issues are detected:
1. Go to Actions → Complete Deployment Pipeline
2. Select "emergency-rollback"
3. Enter version to rollback to
4. All client sites revert in under 2 minutes

## Architecture

### File Structure
```
├── client/              # React frontend
├── server/              # Express API  
├── shared/              # Types and schemas
├── scripts/             # Automation scripts
├── deployments/         # Client configurations (148KB each)
└── .github/workflows/   # Complete automation pipeline
```

### How Client Deployments Work

**Traditional Approach:**
- Copy entire codebase for each client
- 200MB+ per deployment
- Manual database setup
- High maintenance overhead

**Our Efficient System:**
- Shared template codebase
- Client-specific configuration files only
- Automated database provisioning
- 99.9% storage reduction

### Database Automation

The system automatically:
1. Creates database with unique name
2. Initializes schema with all tables
3. Configures connection strings
4. Sets up environment variables
5. Runs initial migrations

### Health Monitoring

During deployments, the system checks:
- Homepage responsiveness
- API endpoint functionality
- Admin panel accessibility  
- Database connectivity
- Response time thresholds

Health threshold: 95% required to proceed

### Canary Deployment Process

1. **Deploy to canary group** (20% of clients)
2. **Monitor for 10 minutes** with health checks
3. **Decision point:**
   - If healthy (≥95%): Deploy to remaining 80%
   - If unhealthy (<95%): Automatic rollback and alert

## Template Features

### Content Management
- Store information and hours
- Product categories with images
- Special services
- Featured brands
- Contact information
- Social media links

### Design System
- Agricultural-themed brown/beige/green palette
- Responsive mobile-first design
- Professional typography
- SEO optimized structure
- Fast loading performance

### Admin Panel
- File upload with size guidance
- Image optimization
- Color customization
- Content editing
- Hours management

### SEO Features
- Structured data markup
- Meta descriptions
- Open Graph tags
- Local business schema
- Fast Core Web Vitals

## Scaling Economics

| Clients | Traditional Storage | Efficient System | Savings |
|---------|-------------------|------------------|---------|
| 10      | 2GB               | 1.5MB            | 99.9%   |
| 100     | 20GB              | 15MB             | 99.9%   |
| 1,000   | 200GB             | 150MB            | 99.9%   |
| 10,000  | 2TB               | 1.5GB            | 99.9%   |

## Support

### Troubleshooting

**Database creation fails:**
- Verify API key permissions
- Check provider quota limits

**GitHub repository creation fails:**
- Ensure token has repo permissions  
- Verify organization settings

**Deployment fails:**
- Check Vercel token permissions
- Verify domain configuration

**Health checks fail:**
- Verify site responsiveness
- Check environment variables
- Review deployment logs

### Getting Help

For technical support or questions about scaling the system, refer to the troubleshooting section above or check the deployment logs in your hosting platform.

The system is designed to be self-managing once properly configured with the required API keys.