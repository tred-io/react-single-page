#!/usr/bin/env node

/**
 * Push Template Code to Client Repository
 * Copies template files and pushes to the new GitHub repository
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class TemplatePusher {
  constructor() {
    this.githubToken = process.env.PERSONAL_ACCESS_TOKEN;
    if (!this.githubToken) {
      throw new Error('PERSONAL_ACCESS_TOKEN not found');
    }
  }

  async pushToRepository(clientName, githubUser = 'trascopur') {
    console.log(`Pushing template code to: ${clientName}`);
    
    try {
      // Create temporary directory for the client repository
      const tempDir = `/tmp/${clientName}-deploy`;
      
      // Clean up any existing temp directory
      if (fs.existsSync(tempDir)) {
        execSync(`rm -rf ${tempDir}`);
      }
      
      // Clone the new repository
      const repoUrl = `https://${this.githubToken}@github.com/${githubUser}/${clientName}.git`;
      execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: 'inherit' });
      
      // Copy template files (excluding .git, node_modules, dist)
      const excludePatterns = [
        '.git',
        'node_modules', 
        'dist',
        'uploads',
        '.env',
        'tests',
        '.replit'
      ];
      
      console.log('Copying template files...');
      
      // Get list of files and directories to copy
      const items = fs.readdirSync('.');
      
      for (const item of items) {
        if (!excludePatterns.includes(item)) {
          const sourcePath = path.resolve(item);
          const targetPath = path.join(tempDir, item);
          
          if (fs.statSync(sourcePath).isDirectory()) {
            execSync(`cp -r "${sourcePath}" "${targetPath}"`);
          } else {
            execSync(`cp "${sourcePath}" "${targetPath}"`);
          }
        }
      }
      
      // Update package.json with client-specific information
      const packageJsonPath = path.join(tempDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.name = clientName;
        packageJson.description = `Professional website for ${clientName}`;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
      
      // Create client-specific README
      const readmePath = path.join(tempDir, 'README.md');
      const clientReadme = `# ${clientName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

Professional website built with React, TypeScript, and Tailwind CSS.

## Features

- Modern responsive design
- Content management system
- Theme customization
- SEO optimization
- Professional branding

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment

This site is automatically deployed via Vercel when changes are pushed to the main branch.

## Environment Variables

- \`CLIENT_NAME\`: The client identifier
- \`DATABASE_URL\`: PostgreSQL connection string
- \`NODE_ENV\`: Environment mode (production/development)
`;
      
      fs.writeFileSync(readmePath, clientReadme);
      
      // Navigate to temp directory and commit changes
      process.chdir(tempDir);
      
      // Configure git user (required for commits)
      execSync('git config user.name "Deployment Bot"');
      execSync('git config user.email "deploy@example.com"');
      
      // Add all files
      execSync('git add .');
      
      // Check if there are changes to commit
      try {
        execSync('git diff --staged --quiet');
        console.log('No changes to commit');
      } catch (error) {
        // There are changes, commit them
        execSync('git commit -m "Initial template deployment"');
        
        // Push to repository
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Template code pushed successfully');
      }
      
      // Clean up
      process.chdir('..');
      execSync(`rm -rf ${tempDir}`);
      
      return true;
      
    } catch (error) {
      console.error(`Push failed: ${error.message}`);
      throw error;
    }
  }
}

async function main() {
  const [,, clientName, githubUser] = process.argv;
  
  if (!clientName) {
    console.error('Usage: node push-template.js <client-name> [github-user]');
    console.error('Example: node push-template.js brown-feed-store trascopur');
    process.exit(1);
  }
  
  try {
    const pusher = new TemplatePusher();
    await pusher.pushToRepository(clientName, githubUser);
    
    console.log('\n🎉 Template deployment completed!');
    console.log(`Repository: https://github.com/${githubUser || 'trascopur'}/${clientName}`);
    console.log('The Vercel deployment will automatically trigger from the repository.');
    
  } catch (error) {
    console.error('Template push error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { TemplatePusher };