#!/usr/bin/env node

/**
 * Create Vercel Project for tred-io Organization Repository
 */

import https from 'https';

class VercelProjectCreator {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
    if (!this.vercelToken) {
      throw new Error('VERCEL_TOKEN not found');
    }
  }

  async makeHttpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${parsed.error?.message || responseData}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
            } else {
              resolve(responseData);
            }
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

  async createProject(clientName, orgName = 'tred-io') {
    console.log(`Creating Vercel project for ${orgName}/${clientName}`);
    
    const projectData = {
      name: clientName,
      gitRepository: {
        type: 'github',
        repo: `${orgName}/${clientName}`
      },
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      installCommand: 'npm install',
      framework: 'vite'
    };

    const options = {
      hostname: 'api.vercel.com',
      path: '/v10/projects',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.vercelToken}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await this.makeHttpsRequest(options, projectData);
      console.log(`Vercel project created: ${response.name}`);
      console.log(`Project URL: https://${response.alias?.[0] || `${clientName}.vercel.app`}`);
      return response;
    } catch (error) {
      console.error(`Vercel project creation failed: ${error.message}`);
      throw error;
    }
  }

  async setEnvironmentVariables(projectId, clientName, databaseUrl) {
    console.log(`Setting environment variables for project: ${projectId}`);
    
    const envVars = [
      { key: 'CLIENT_NAME', value: clientName, type: 'encrypted', target: ['production', 'preview', 'development'] },
      { key: 'DATABASE_URL', value: databaseUrl, type: 'encrypted', target: ['production', 'preview', 'development'] },
      { key: 'NODE_ENV', value: 'production', type: 'encrypted', target: ['production'] }
    ];

    for (const envVar of envVars) {
      const options = {
        hostname: 'api.vercel.com',
        path: `/v9/projects/${projectId}/env`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        await this.makeHttpsRequest(options, envVar);
        console.log(`Environment variable set: ${envVar.key}`);
      } catch (error) {
        console.log(`Environment variable ${envVar.key}: ${error.message}`);
      }
    }
  }
}

async function main() {
  const [,, clientName, databaseUrl] = process.argv;
  
  if (!clientName || !databaseUrl) {
    console.error('Usage: node create-vercel-project.js <client-name> <database-url>');
    console.error('Example: node create-vercel-project.js brown-feed-store "postgresql://..."');
    process.exit(1);
  }
  
  try {
    const creator = new VercelProjectCreator();
    const project = await creator.createProject(clientName);
    await creator.setEnvironmentVariables(project.id, clientName, databaseUrl);
    
    console.log('\nVercel Project Setup Complete:');
    console.log(`Project ID: ${project.id}`);
    console.log(`Repository: tred-io/${clientName}`);
    console.log(`URL: https://${project.alias?.[0] || `${clientName}.vercel.app`}`);
    
  } catch (error) {
    console.error('Setup error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { VercelProjectCreator };