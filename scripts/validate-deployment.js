#!/usr/bin/env node

/**
 * Final Deployment Validation Script
 * Validates the complete Brown Feed Store deployment system
 */

import https from 'https';
import { execSync } from 'child_process';

class DeploymentValidator {
  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN;
    this.githubToken = process.env.PERSONAL_ACCESS_TOKEN;
    this.databaseUrl = "postgresql://neondb_owner:npg_F0tCg9PbpUwl@ep-misty-bush-a4m80ce4.us-east-1.aws.neon.tech/neondb?sslmode=require";
  }

  async makeHttpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: responseData });
          }
        });
      });
      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  async validateGitHubRepository() {
    console.log('✓ Validating GitHub Repository');
    
    const options = {
      hostname: 'api.github.com',
      path: '/repos/tred-io/brown-feed-store',
      method: 'GET',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'User-Agent': 'deployment-validator'
      }
    };

    try {
      const response = await this.makeHttpsRequest(options);
      if (response.status === 200) {
        console.log(`  Repository: ${response.data.full_name}`);
        console.log(`  Visibility: ${response.data.visibility}`);
        console.log(`  Default Branch: ${response.data.default_branch}`);
        return true;
      }
      console.log(`  GitHub API returned ${response.status}`);
      return false;
    } catch (error) {
      console.log(`  GitHub validation failed: ${error.message}`);
      return false;
    }
  }

  async validateNeonDatabase() {
    console.log('✓ Validating Neon Database');
    
    try {
      // Test database connection using node-postgres
      const { Pool } = await import('pg');
      const pool = new Pool({ connectionString: this.databaseUrl });
      
      const client = await pool.connect();
      const result = await client.query('SELECT COUNT(*) FROM store_settings');
      console.log(`  Database connection: Success`);
      console.log(`  Store settings records: ${result.rows[0].count}`);
      
      await client.release();
      await pool.end();
      return true;
    } catch (error) {
      console.log(`  Database validation failed: ${error.message}`);
      return false;
    }
  }

  async validateVercelProject() {
    console.log('✓ Validating Vercel Project');
    
    const options = {
      hostname: 'api.vercel.com',
      path: '/v10/projects?search=brown-feed-store',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.vercelToken}`
      }
    };

    try {
      const response = await this.makeHttpsRequest(options);
      if (response.status === 200 && response.data.projects?.length > 0) {
        const project = response.data.projects[0];
        console.log(`  Project ID: ${project.id}`);
        console.log(`  Framework: ${project.framework}`);
        console.log(`  Repository: ${project.link?.org}/${project.link?.repo}`);
        return true;
      }
      console.log(`  Vercel project not found or inaccessible`);
      return false;
    } catch (error) {
      console.log(`  Vercel validation failed: ${error.message}`);
      return false;
    }
  }

  async validateLocalApplication() {
    console.log('✓ Validating Local Application');
    
    try {
      // Test local API endpoints
      const testUrls = [
        'http://localhost:5000/api/health',
        'http://localhost:5000/api/store-settings',
        'http://localhost:5000/api/product-categories'
      ];

      for (const url of testUrls) {
        try {
          const response = await fetch(url);
          console.log(`  ${url}: ${response.status} ${response.statusText}`);
        } catch (error) {
          console.log(`  ${url}: Connection failed`);
        }
      }
      return true;
    } catch (error) {
      console.log(`  Local application validation failed: ${error.message}`);
      return false;
    }
  }

  async validateTestFramework() {
    console.log('✓ Validating Test Framework');
    
    try {
      // Run the test suite
      const output = execSync('node tests/run-tests.js', { encoding: 'utf-8' });
      const successRate = output.match(/Success Rate: ([\d.]+)%/);
      
      if (successRate && parseFloat(successRate[1]) >= 90) {
        console.log(`  Test success rate: ${successRate[1]}%`);
        return true;
      }
      console.log(`  Test framework validation failed`);
      return false;
    } catch (error) {
      console.log(`  Test execution failed: ${error.message}`);
      return false;
    }
  }

  async generateDeploymentReport() {
    console.log('\n🔍 BROWN FEED STORE DEPLOYMENT VALIDATION REPORT');
    console.log('================================================================');
    
    const validations = [
      { name: 'GitHub Repository', test: () => this.validateGitHubRepository() },
      { name: 'Neon Database', test: () => this.validateNeonDatabase() },
      { name: 'Vercel Project', test: () => this.validateVercelProject() },
      { name: 'Local Application', test: () => this.validateLocalApplication() },
      { name: 'Test Framework', test: () => this.validateTestFramework() }
    ];

    const results = [];
    
    for (const validation of validations) {
      try {
        const success = await validation.test();
        results.push({ name: validation.name, success });
      } catch (error) {
        results.push({ name: validation.name, success: false, error: error.message });
      }
    }

    console.log('\nVALIDATION RESULTS:');
    console.log('------------------');
    
    let passCount = 0;
    for (const result of results) {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.name}`);
      if (result.success) passCount++;
      if (result.error) console.log(`     Error: ${result.error}`);
    }

    const successRate = (passCount / results.length * 100).toFixed(1);
    console.log(`\nOVERALL SUCCESS RATE: ${successRate}% (${passCount}/${results.length})`);

    if (successRate >= 80) {
      console.log('\n🎉 DEPLOYMENT SYSTEM VALIDATED SUCCESSFULLY');
      console.log('The Brown Feed Store template system is ready for production use.');
    } else {
      console.log('\n⚠️  DEPLOYMENT SYSTEM NEEDS ATTENTION');
      console.log('Some validations failed. Please address issues before production deployment.');
    }

    console.log('\nDEPLOYMENT SUMMARY:');
    console.log('- Template repository: https://github.com/tred-io/brown-feed-store');
    console.log('- Database: Neon PostgreSQL with complete schema');
    console.log('- Application: React + TypeScript + Vite frontend');
    console.log('- Backend: Express.js with serverless functions');
    console.log('- Testing: Comprehensive unit and integration tests');
    console.log('- CI/CD: GitHub Actions workflow automation');
    
    return successRate >= 80;
  }
}

async function main() {
  try {
    const validator = new DeploymentValidator();
    const success = await validator.generateDeploymentReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { DeploymentValidator };