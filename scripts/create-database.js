#!/usr/bin/env node

/**
 * Database Creation Script
 * Supports Neon, Supabase, and PlanetScale
 */

import https from 'https';
import { execSync } from 'child_process';

class DatabaseManager {
  constructor(provider, credentials) {
    this.provider = provider;
    this.credentials = credentials;
  }

  async createNeonDatabase(projectName) {
    const data = JSON.stringify({
      project: {
        name: projectName,
        region_id: "aws-us-east-1"
      }
    });

    const options = {
      hostname: 'console.neon.tech',
      port: 443,
      path: '/api/v2/projects',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode === 201) {
              resolve({
                projectId: response.project.id,
                connectionString: response.connection_uris[0].connection_uri,
                host: response.project.host,
                database: response.project.database
              });
            } else {
              reject(new Error(`Neon API error: ${response.message}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async createSupabaseDatabase(projectName) {
    const data = JSON.stringify({
      name: projectName,
      organization_id: this.credentials.orgId,
      plan: "free",
      region: "us-east-1"
    });

    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: '/v1/projects',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode === 201) {
              const host = response.database.host;
              const connectionString = `postgresql://postgres:[PASSWORD]@${host}:5432/postgres`;
              resolve({
                projectId: response.id,
                connectionString,
                host,
                database: 'postgres'
              });
            } else {
              reject(new Error(`Supabase API error: ${response.message}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async createPlanetScaleDatabase(projectName) {
    try {
      // Install PlanetScale CLI if not present
      try {
        execSync('pscale version', { stdio: 'ignore' });
      } catch {
        console.log('Installing PlanetScale CLI...');
        execSync('curl -L https://github.com/planetscale/cli/releases/latest/download/pscale_linux_amd64.tar.gz | tar -xz', { stdio: 'inherit' });
        execSync('sudo mv pscale /usr/local/bin', { stdio: 'inherit' });
      }

      // Authenticate
      execSync(`pscale auth login --service-token ${this.credentials.serviceToken} --service-token-id ${this.credentials.serviceTokenId}`, { stdio: 'inherit' });

      // Create database
      execSync(`pscale database create ${projectName} --region us-east`, { stdio: 'inherit' });

      // Get connection string
      const connectionString = execSync(`pscale connect ${projectName} main --execute-env-url`).toString().trim();

      return {
        projectId: projectName,
        connectionString,
        database: projectName
      };
    } catch (error) {
      throw new Error(`PlanetScale error: ${error.message}`);
    }
  }

  async createDatabase(projectName) {
    console.log(`Creating ${this.provider} database: ${projectName}`);

    switch (this.provider) {
      case 'neon':
        return await this.createNeonDatabase(projectName);
      case 'supabase':
        return await this.createSupabaseDatabase(projectName);
      case 'planetscale':
        return await this.createPlanetScaleDatabase(projectName);
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node create-database.js <provider> <project-name>');
    console.log('Providers: neon, supabase, planetscale');
    process.exit(1);
  }

  const [provider, projectName] = args;
  
  // Get credentials from environment
  let credentials;
  switch (provider) {
    case 'neon':
      credentials = { apiKey: process.env.NEON_API_KEY };
      break;
    case 'supabase':
      credentials = { 
        accessToken: process.env.SUPABASE_ACCESS_TOKEN,
        orgId: process.env.SUPABASE_ORG_ID
      };
      break;
    case 'planetscale':
      credentials = {
        serviceToken: process.env.PLANETSCALE_SERVICE_TOKEN,
        serviceTokenId: process.env.PLANETSCALE_SERVICE_TOKEN_ID
      };
      break;
    default:
      console.error(`Unsupported provider: ${provider}`);
      process.exit(1);
  }

  try {
    const manager = new DatabaseManager(provider, credentials);
    const result = await manager.createDatabase(projectName);
    
    console.log('Database created successfully!');
    console.log('Connection details:');
    console.log(`Project ID: ${result.projectId}`);
    console.log(`Connection String: ${result.connectionString}`);
    
    // Output for GitHub Actions
    if (process.env.GITHUB_ENV) {
      const fs = require('fs');
      fs.appendFileSync(process.env.GITHUB_ENV, `DATABASE_URL=${result.connectionString}\n`);
      fs.appendFileSync(process.env.GITHUB_ENV, `PROJECT_ID=${result.projectId}\n`);
    }
  } catch (error) {
    console.error('Database creation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { DatabaseManager };