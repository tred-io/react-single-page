# Deploy SP Upholstery - Instructions

## Automated GitHub Actions Deployment

1. **Go to your GitHub repository**
2. **Click the "Actions" tab**
3. **Select "Complete Deployment Pipeline"**
4. **Click "Run workflow"**
5. **Fill in the following inputs:**
   - Action: `deploy-new-client`
   - Client name: `sp-upholstery`
   - Domain: `spupholstery.com`
   - Database provider: `neon`
   - Deployment strategy: `canary`

6. **Click "Run workflow"**

## What the automation will do:

- Create a Neon database for SP Upholstery
- Set up the database schema
- Create a GitHub repository: `sp-upholstery-website`
- Deploy to Vercel with the domain spupholstery.com
- Run health checks
- Populate with the SP Upholstery content we prepared

## After deployment:

- Live site: https://spupholstery.com
- Admin panel: https://spupholstery.com/admin
- Repository: https://github.com/[your-username]/sp-upholstery-website

The site will have all the upholstery content, theme colors, and business information we configured.