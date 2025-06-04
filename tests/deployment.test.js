#!/usr/bin/env node

/**
 * Deployment System Unit Tests
 * Tests database creation, client initialization, and health monitoring
 */

import { strict as assert } from 'assert';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DeploymentTests {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
  }

  log(message) {
    console.log(`[TEST] ${message}`);
  }

  async runTest(testName, testFunction) {
    try {
      this.log(`Running: ${testName}`);
      await testFunction();
      this.testResults.push({ name: testName, status: 'PASS' });
      this.log(`✅ PASS: ${testName}`);
    } catch (error) {
      this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
      this.failedTests.push({ name: testName, error: error.message });
      this.log(`❌ FAIL: ${testName} - ${error.message}`);
    }
  }

  // Test 1: Validate project structure
  async testProjectStructure() {
    const requiredDirs = ['scripts', 'server', 'client', 'shared', '.github/workflows'];
    const requiredFiles = [
      'scripts/create-database.js',
      'scripts/health-monitor.js', 
      'scripts/init-client.js',
      'server/index.ts',
      'api/index.ts',
      'vercel.json'
    ];

    for (const dir of requiredDirs) {
      assert(fs.existsSync(dir), `Required directory missing: ${dir}`);
    }

    for (const file of requiredFiles) {
      assert(fs.existsSync(file), `Required file missing: ${file}`);
    }
  }

  // Test 2: Validate API endpoints
  async testApiEndpoints() {
    const endpoints = [
      '/api/store-settings',
      '/api/product-categories', 
      '/api/special-services',
      '/api/featured-brands'
    ];

    for (const endpoint of endpoints) {
      await this.checkEndpoint('localhost:5000', endpoint);
    }
  }

  async checkEndpoint(host, path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              JSON.parse(data);
              resolve();
            } catch {
              reject(new Error(`Invalid JSON response from ${path}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode} from ${path}`));
          }
        });
      });

      req.on('error', () => reject(new Error(`Connection failed to ${path}`)));
      req.on('timeout', () => reject(new Error(`Timeout on ${path}`)));
      req.setTimeout(5000);
      req.end();
    });
  }

  // Test 3: Validate configuration files
  async testConfigurationFiles() {
    // Test vercel.json
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    assert(vercelConfig.buildCommand, 'vercel.json missing buildCommand');
    assert(vercelConfig.outputDirectory, 'vercel.json missing outputDirectory');
    assert(vercelConfig.functions, 'vercel.json missing functions config');

    // Test package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert(packageJson.scripts.build, 'package.json missing build script');
    assert(packageJson.scripts.dev, 'package.json missing dev script');
  }

  // Test 4: Validate GitHub Actions workflows
  async testGithubWorkflows() {
    const workflowDir = '.github/workflows';
    const workflows = fs.readdirSync(workflowDir);
    
    assert(workflows.length > 0, 'No GitHub Actions workflows found');

    for (const workflow of workflows) {
      if (workflow.endsWith('.yml')) {
        const content = fs.readFileSync(path.join(workflowDir, workflow), 'utf8');
        assert(content.includes('on:'), `Workflow ${workflow} missing trigger configuration`);
        assert(content.includes('jobs:'), `Workflow ${workflow} missing jobs configuration`);
      }
    }
  }

  // Test 5: Database creation script validation
  async testDatabaseScript() {
    const scriptPath = 'scripts/create-database.js';
    const content = fs.readFileSync(scriptPath, 'utf8');
    
    assert(content.includes('class DatabaseManager'), 'DatabaseManager class not found');
    assert(content.includes('createNeonDatabase'), 'Neon database creation method missing');
    assert(content.includes('createSupabaseDatabase'), 'Supabase database creation method missing');
    assert(content.includes('createPlanetScaleDatabase'), 'PlanetScale database creation method missing');
  }

  // Test 6: Health monitoring script validation
  async testHealthMonitorScript() {
    const scriptPath = 'scripts/health-monitor.js';
    const content = fs.readFileSync(scriptPath, 'utf8');
    
    assert(content.includes('class HealthMonitor'), 'HealthMonitor class not found');
    assert(content.includes('checkSiteHealth'), 'checkSiteHealth method missing');
    assert(content.includes('monitorCanaryGroup'), 'monitorCanaryGroup method missing');
  }

  // Test 7: Client initialization script validation
  async testClientInitScript() {
    const scriptPath = 'scripts/init-client.js';
    const content = fs.readFileSync(scriptPath, 'utf8');
    
    assert(content.includes('initializeClientSchema'), 'initializeClientSchema import missing');
    assert(content.includes('initializeClientData'), 'initializeClientData import missing');
    assert(content.includes('process.argv'), 'Command line argument handling missing');
  }

  // Test 8: Environment variable handling
  async testEnvironmentVariables() {
    const serverIndexPath = 'server/index.ts';
    const content = fs.readFileSync(serverIndexPath, 'utf8');
    
    assert(content.includes('process.env.CLIENT_NAME'), 'CLIENT_NAME environment variable not used');
    assert(content.includes('process.env.DATABASE_URL'), 'DATABASE_URL environment variable not used');
  }

  // Test 9: API route consolidation validation
  async testApiConsolidation() {
    const apiIndexPath = 'api/index.ts';
    const content = fs.readFileSync(apiIndexPath, 'utf8');
    
    assert(content.includes('/api/store-settings'), 'store-settings endpoint missing');
    assert(content.includes('/api/product-categories'), 'product-categories endpoint missing');
    assert(content.includes('/api/special-services'), 'special-services endpoint missing');
    assert(content.includes('/api/featured-brands'), 'featured-brands endpoint missing');
    assert(content.includes('Access-Control-Allow-Origin'), 'CORS configuration missing');
  }

  // Test 10: Shared schema validation
  async testSharedSchema() {
    const schemaPath = 'shared/schema.ts';
    const content = fs.readFileSync(schemaPath, 'utf8');
    
    assert(content.includes('interface StoreSettings'), 'StoreSettings interface missing');
    assert(content.includes('interface ThemeOption'), 'ThemeOption interface missing');
    assert(content.includes('interface ThemeGenerationResult'), 'ThemeGenerationResult interface missing');
  }

  async runAllTests() {
    this.log('Starting Deployment System Unit Tests...\n');

    await this.runTest('Project Structure', () => this.testProjectStructure());
    await this.runTest('API Endpoints', () => this.testApiEndpoints());
    await this.runTest('Configuration Files', () => this.testConfigurationFiles());
    await this.runTest('GitHub Workflows', () => this.testGithubWorkflows());
    await this.runTest('Database Script', () => this.testDatabaseScript());
    await this.runTest('Health Monitor Script', () => this.testHealthMonitorScript());
    await this.runTest('Client Init Script', () => this.testClientInitScript());
    await this.runTest('Environment Variables', () => this.testEnvironmentVariables());
    await this.runTest('API Consolidation', () => this.testApiConsolidation());
    await this.runTest('Shared Schema', () => this.testSharedSchema());

    this.generateReport();
  }

  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAIL').length;

    console.log('\n' + '='.repeat(60));
    console.log('DEPLOYMENT SYSTEM TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (this.failedTests.length > 0) {
      console.log('\nFAILED TESTS:');
      this.failedTests.forEach(test => {
        console.log(`❌ ${test.name}: ${test.error}`);
      });
    }

    console.log('\nDETAILED RESULTS:');
    this.testResults.forEach(test => {
      const status = test.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
    });

    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! Deployment system is ready.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix issues before deployment.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new DeploymentTests();
  tests.runAllTests().catch(console.error);
}

export { DeploymentTests };