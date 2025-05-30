# test-efficient Website

This is a lightweight deployment configuration for test-efficient that references the shared template codebase.

## Structure
- **Template code**: Located at `../../..` (shared across all clients)
- **Client config**: `client-config.json` (unique to this client)
- **Environment**: `.env` (client-specific settings)

## Deployment
This configuration uses the shared template codebase to minimize storage and maintenance overhead.

**Domain**: testefficient.com
**Deployed**: Fri 30 May 2025 06:12:58 AM UTC
**Template Version**: 1.0.0

## Development
```bash
# Install dependencies (in template root)
cd ../../..
npm install

# Start development server for this client
cd deployments/test-efficient
npm run dev
```

## Production Deployment
The Vercel configuration points to the shared template build, with client-specific environment variables.
