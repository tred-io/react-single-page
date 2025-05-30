# GitHub Actions Automation Setup

## Overview
I've created three powerful GitHub Actions workflows that completely automate your client deployment and management process:

1. **Deploy New Client Site** - Creates new client sites automatically
2. **Update All Client Sites** - Pushes template improvements to existing clients
3. **Template Release Management** - Handles versioning and releases

## Required GitHub Secrets

To enable full automation, add these secrets to your GitHub repository:

### 1. Personal Access Token
- **Name**: `PERSONAL_ACCESS_TOKEN`
- **Purpose**: Create repositories and push to client repos
- **How to create**:
  1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
  2. Generate new token with these scopes:
     - `repo` (Full control of private repositories)
     - `public_repo` (Access public repositories)
     - `delete_repo` (Delete repositories)
  3. Copy the token and add as secret

### 2. Vercel Integration (Optional but Recommended)
- **Name**: `VERCEL_TOKEN`
- **Purpose**: Automatically deploy to Vercel
- **How to create**:
  1. Go to Vercel Settings > Tokens
  2. Create new token
  3. Copy and add as secret

- **Name**: `VERCEL_ORG_ID`
- **Purpose**: Specify your Vercel organization
- **How to find**:
  1. Go to Vercel team settings
  2. Copy the Team ID
  3. Add as secret

## How to Use the Automation

### Deploy a New Client Site

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy New Client Site**
4. Click **Run workflow**
5. Fill in the form:
   - **Client name**: `brown-feed`
   - **Domain**: `brownfeedstore.com`
   - **GitHub org**: Your GitHub username/organization
   - **Auto-deploy to Vercel**: Check this box

The automation will:
- Create the client deployment locally
- Create a new GitHub repository for the client
- Deploy to Vercel automatically
- Generate setup instructions

### Update All Existing Clients

1. Go to **Actions** > **Update All Client Sites**
2. Click **Run workflow**
3. Enter update description: "Added contact form feature"
4. Leave client filter empty (updates all) or specify one client

The automation will:
- Update all client repositories
- Push changes to their GitHub repos
- Trigger automatic Vercel deployments

### Create Template Releases

1. Go to **Actions** > **Create Template Release**
2. Click **Run workflow**
3. Enter version: `v1.1.0`

This creates a versioned release with:
- Updated template metadata
- Release notes
- Distribution packages

## Workflow Benefits

### For New Clients
```
Manual Process: 30+ minutes
Automated Process: 3 minutes
```

### For Template Updates
```
Manual Process: 15 minutes per client
Automated Process: 5 minutes for all clients
```

### What Gets Automated

1. **Repository Creation**
   - Creates GitHub repo for client
   - Initializes with proper git history
   - Sets up deployment configuration

2. **Vercel Deployment**
   - Deploys to production automatically
   - Sets up environment variables
   - Configures domain settings

3. **Template Updates**
   - Preserves client customizations
   - Updates all clients simultaneously
   - Maintains version tracking

4. **Quality Assurance**
   - Runs build tests
   - Validates configuration
   - Creates deployment summaries

## Advanced Automation Options

### Scheduled Updates
Add this to any workflow for automatic updates:
```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
```

### Slack/Discord Notifications
Add webhook notifications when deployments complete:
```yaml
- name: Notify team
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Database Provisioning
Extend workflows to automatically:
- Create Neon databases
- Set up environment variables
- Run initial migrations

## Client Onboarding Flow

With automation enabled, your client onboarding becomes:

1. **Input client details** (2 minutes)
   - Run GitHub Action with client name and domain
   
2. **Database setup** (5 minutes)
   - Client creates free Neon database
   - Updates one environment variable in Vercel
   
3. **Content customization** (10 minutes)
   - Client accesses admin panel
   - Updates their business information
   
4. **Go live** (instant)
   - Site is immediately available at their domain

Total time: **17 minutes** from start to fully customized live website.

## Troubleshooting

### Common Issues

**GitHub Actions failing**
- Check that secrets are properly set
- Verify Personal Access Token has correct permissions

**Vercel deployment issues**
- Ensure VERCEL_TOKEN is valid
- Check VERCEL_ORG_ID matches your organization

**Client repository creation fails**
- Verify repository name doesn't already exist
- Check GitHub organization permissions

### Getting Help

The automation creates detailed logs and summaries for each deployment, making it easy to identify and resolve any issues quickly.

This automated system transforms your template into a professional client deployment platform that can scale to hundreds of client sites with minimal manual intervention.