#!/usr/bin/env node

/**
 * Deploy Working Brown Feed Store to Vercel
 * Creates a direct deployment with the complete working codebase
 */

import https from 'https';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

class WorkingSiteDeployer {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
  }

  async deployWorkingSite() {
    console.log('Deploying Working Brown Feed Store to Vercel');
    console.log('============================================');

    try {
      // Create deployment with all necessary files
      const files = await this.collectProjectFiles();
      
      const deploymentData = {
        name: 'brown-feed-store-working',
        files: files,
        projectSettings: {
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm install',
          devCommand: 'npm run dev',
          framework: 'vite'
        },
        target: 'production'
      };

      console.log(`Uploading ${files.length} files to Vercel...`);
      
      const deployment = await this.makeRequest('POST', '/v13/deployments', deploymentData);
      
      if (deployment && deployment.url) {
        console.log(`Deployment created: https://${deployment.url}`);
        
        // Wait for deployment to be ready
        console.log('Waiting for deployment to be ready...');
        await this.waitForDeployment(deployment.url);
        
        return deployment;
      } else {
        console.log('Deployment failed:', deployment);
        return null;
      }

    } catch (error) {
      console.error('Deployment error:', error.message);
      return null;
    }
  }

  async collectProjectFiles() {
    const files = [];
    const rootDir = '/home/runner/workspace';
    
    // Essential project files
    const essentialFiles = [
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'vercel.json'
    ];

    // Add essential files
    for (const file of essentialFiles) {
      try {
        const content = readFileSync(join(rootDir, file), 'utf-8');
        files.push({
          file: file,
          data: content
        });
      } catch (error) {
        console.log(`Warning: Could not read ${file}`);
      }
    }

    // Add client directory
    this.addDirectoryFiles(files, join(rootDir, 'client'), 'client');
    
    // Add server directory
    this.addDirectoryFiles(files, join(rootDir, 'server'), 'server');
    
    // Add shared directory
    this.addDirectoryFiles(files, join(rootDir, 'shared'), 'shared');
    
    // Add api directory
    this.addDirectoryFiles(files, join(rootDir, 'api'), 'api');

    return files;
  }

  addDirectoryFiles(files, dirPath, prefix) {
    try {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const relativePath = `${prefix}/${item}`;
        
        try {
          const stat = statSync(fullPath);
          
          if (stat.isDirectory()) {
            this.addDirectoryFiles(files, fullPath, relativePath);
          } else if (stat.isFile()) {
            const content = readFileSync(fullPath, 'utf-8');
            files.push({
              file: relativePath,
              data: content
            });
          }
        } catch (error) {
          console.log(`Warning: Could not process ${relativePath}`);
        }
      }
    } catch (error) {
      console.log(`Warning: Could not read directory ${dirPath}`);
    }
  }

  async waitForDeployment(url, maxWaitTime = 120000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await fetch(`https://${url}`);
        if (response.status === 200) {
          console.log(`Deployment ready: https://${url}`);
          return true;
        }
      } catch (error) {
        // Continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log('Deployment timeout - may still be building');
    return false;
  }

  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.vercel.com',
        path: path,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              console.error(`Vercel API error ${res.statusCode}:`, parsed.message || responseData);
              resolve(null);
            }
          } catch (e) {
            console.error('Response parsing error:', e.message);
            resolve(null);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

async function main() {
  const deployer = new WorkingSiteDeployer();
  const deployment = await deployer.deployWorkingSite();
  
  if (deployment) {
    console.log('');
    console.log('BROWN FEED STORE DEPLOYMENT SUCCESSFUL');
    console.log('======================================');
    console.log(`Live URL: https://${deployment.url}`);
    console.log('Features: Complete React frontend with API backend');
    console.log('Database: Authentic Brown Feed Store business data');
  } else {
    console.log('Deployment failed - check Vercel token and permissions');
  }
  
  process.exit(deployment ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { WorkingSiteDeployer };