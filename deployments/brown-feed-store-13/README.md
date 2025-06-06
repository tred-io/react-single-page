# brown-feed-store-13 Website

This is an efficient client deployment that references the main template repository.

## Configuration

- **Client**: brown-feed-store-13  
- **Domain**: brownfeedstore13.com
- **Template Version**: d1e0154
- **Deployed**: 2025-06-06T06:39:53Z

## Files Structure

This deployment contains only configuration files:
- `client-config.json` - Client-specific settings
- `vercel.json` - Deployment configuration  
- `api/index.ts` - API entry point that references template
- `package.json` - Minimal dependencies

The actual application code remains in the template repository, ensuring:
- 99% storage reduction per client
- Instant template updates across all clients
- Single codebase to maintain

## Admin Panel

Once deployed, access the admin panel at: https://brownfeedstore13.com/admin

## Template Updates

All updates are pushed automatically from the template repository.
No manual changes should be made to this repository.
