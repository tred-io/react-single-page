# sp-upholstery Website

This is a lightweight deployment configuration for sp-upholstery that references the shared template codebase.

## Structure
- **Template code**: Located at `../../..` (shared across all clients)
- **Client config**: `client-config.json` (unique to this client)
- **Environment**: `.env` (client-specific settings)

## Deployment
This configuration uses the shared template codebase to minimize storage and maintenance overhead.

**Domain**: spupholstery.com
**Deployed**: Fri 30 May 2025 05:02:23 PM UTC
**Template Version**: 1.0.0

## Development
```bash
# Install dependencies (in template root)
cd ../../..
npm install

# Start development server for this client
cd deployments/sp-upholstery
npm run dev
```

## Production Deployment
The Vercel configuration points to the shared template build, with client-specific environment variables.
