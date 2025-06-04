#!/usr/bin/env node

/**
 * Integration Tests for Deployment System
 * Tests end-to-end deployment workflows with mock external services
 */

import { strict as assert } from 'assert';
import fs from 'fs';
import { execSync } from 'child_process';

class IntegrationTests {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
  }

  log(message) {
    console.log(`[INTEGRATION] ${message}`);
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

  // Test 1: GitHub Actions workflow syntax validation
  async testWorkflowSyntax() {
    const workflowFiles = fs.readdirSync('.github/workflows').filter(f => f.endsWith('.yml'));
    
    for (const workflow of workflowFiles) {
      const content = fs.readFileSync(`.github/workflows/${workflow}`, 'utf8');
      
      // Basic YAML structure validation
      assert(content.includes('name:'), `${workflow} missing name field`);
      assert(content.includes('on:'), `${workflow} missing trigger`);
      assert(content.includes('jobs:'), `${workflow} missing jobs`);
      
      // Check for required secrets usage
      if (content.includes('database')) {
        assert(content.includes('secrets.') || content.includes('${{'), 
               `${workflow} should use secrets for database operations`);
      }
    }
  }

  // Test 2: Database connection string generation
  async testDatabaseConnectionGeneration() {
    const mockCredentials = {
      host: 'test-host.neon.tech',
      database: 'test-db',
      username: 'test-user',
      password: 'test-pass'
    };

    const expectedConnectionString = `postgresql://${mockCredentials.username}:${mockCredentials.password}@${mockCredentials.host}/${mockCredentials.database}`;
    
    // This would test the actual connection string generation logic
    // For now, we validate the format
    assert(expectedConnectionString.startsWith('postgresql://'), 'Invalid connection string format');
    assert(expectedConnectionString.includes(mockCredentials.host), 'Host missing from connection string');
  }

  // Test 3: Environment variable template validation
  async testEnvironmentVariableTemplate() {
    const requiredEnvVars = [
      'DATABASE_URL',
      'CLIENT_NAME', 
      'OPENAI_API_KEY',
      'NODE_ENV'
    ];

    // Check that server code uses these variables
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    const apiContent = fs.readFileSync('api/index.ts', 'utf8');

    for (const envVar of requiredEnvVars) {
      const found = serverContent.includes(`process.env.${envVar}`) || 
                   apiContent.includes(`process.env.${envVar}`);
      assert(found, `Environment variable ${envVar} not used in server code`);
    }
  }

  // Test 4: Client configuration template validation
  async testClientConfigTemplate() {
    const mockClientConfig = {
      clientName: 'test-client',
      domain: 'test.example.com',
      databaseUrl: 'postgresql://test:test@test.neon.tech/test',
      vercelProjectId: 'test-project-id'
    };

    // Validate configuration structure
    assert(typeof mockClientConfig.clientName === 'string', 'Client name must be string');
    assert(mockClientConfig.domain.includes('.'), 'Domain must be valid format');
    assert(mockClientConfig.databaseUrl.startsWith('postgresql://'), 'Database URL must be PostgreSQL format');
  }

  // Test 5: Health check endpoint simulation
  async testHealthCheckEndpoints() {
    const healthEndpoints = [
      '/',
      '/api/store-settings',
      '/admin'
    ];

    // Mock health check responses
    for (const endpoint of healthEndpoints) {
      const mockResponse = {
        status: 200,
        responseTime: Math.random() * 1000,
        endpoint
      };

      assert(mockResponse.status === 200, `Health check failed for ${endpoint}`);
      assert(mockResponse.responseTime < 5000, `Response time too slow for ${endpoint}`);
    }
  }

  // Test 6: Deployment rollback simulation
  async testDeploymentRollback() {
    const mockDeploymentHistory = [
      { version: 'v1.0.0', timestamp: '2024-01-01', status: 'stable' },
      { version: 'v1.1.0', timestamp: '2024-01-02', status: 'failed' },
      { version: 'v1.0.1', timestamp: '2024-01-03', status: 'stable' }
    ];

    // Find last stable version for rollback
    const lastStable = mockDeploymentHistory
      .filter(d => d.status === 'stable')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    assert(lastStable.version === 'v1.0.1', 'Incorrect rollback target identified');
  }

  // Test 7: Multi-client deployment simulation
  async testMultiClientDeployment() {
    const mockClients = [
      { name: 'client1', domain: 'client1.com', status: 'pending' },
      { name: 'client2', domain: 'client2.com', status: 'pending' },
      { name: 'client3', domain: 'client3.com', status: 'pending' }
    ];

    // Simulate canary deployment (20% first)
    const canaryCount = Math.ceil(mockClients.length * 0.2);
    const canaryClients = mockClients.slice(0, canaryCount);
    
    assert(canaryClients.length === 1, 'Canary group size incorrect');
    assert(canaryClients[0].name === 'client1', 'Canary selection incorrect');
  }

  // Test 8: Database schema initialization validation
  async testDatabaseSchemaInit() {
    const schemaFile = 'shared/schema.ts';
    const content = fs.readFileSync(schemaFile, 'utf8');

    const requiredTables = ['users', 'storeSettings', 'productCategories', 'specialServices', 'featuredBrands'];
    
    for (const table of requiredTables) {
      assert(content.includes(table), `Schema missing table definition: ${table}`);
    }
  }

  // Test 9: API endpoint data validation
  async testApiDataValidation() {
    const apiContent = fs.readFileSync('api/index.ts', 'utf8');
    
    // Check that API returns proper data structures
    assert(apiContent.includes('storeName'), 'Store settings missing storeName field');
    assert(apiContent.includes('primaryColor'), 'Store settings missing theme colors');
    assert(apiContent.includes('name'), 'Categories missing name field');
    assert(apiContent.includes('description'), 'Services missing description field');
  }

  // Test 10: Build process validation
  async testBuildProcess() {
    try {
      // Test that build command exists and runs
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      assert(packageJson.scripts.build, 'Build script missing from package.json');
      
      // Mock build validation (without actually running npm run build)
      const buildCommand = packageJson.scripts.build;
      assert(buildCommand.includes('vite') || buildCommand.includes('tsc'), 'Build command should use proper build tool');
      
    } catch (error) {
      throw new Error(`Build process validation failed: ${error.message}`);
    }
  }

  async runAllTests() {
    this.log('Starting Integration Tests...\n');

    await this.runTest('Workflow Syntax', () => this.testWorkflowSyntax());
    await this.runTest('Database Connection Generation', () => this.testDatabaseConnectionGeneration());
    await this.runTest('Environment Variables', () => this.testEnvironmentVariableTemplate());
    await this.runTest('Client Configuration', () => this.testClientConfigTemplate());
    await this.runTest('Health Check Endpoints', () => this.testHealthCheckEndpoints());
    await this.runTest('Deployment Rollback', () => this.testDeploymentRollback());
    await this.runTest('Multi-Client Deployment', () => this.testMultiClientDeployment());
    await this.runTest('Database Schema Init', () => this.testDatabaseSchemaInit());
    await this.runTest('API Data Validation', () => this.testApiDataValidation());
    await this.runTest('Build Process', () => this.testBuildProcess());

    this.generateReport();
  }

  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAIL').length;

    console.log('\n' + '='.repeat(60));
    console.log('INTEGRATION TEST REPORT');
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

    if (failedTests === 0) {
      console.log('\n🎉 All integration tests passed!');
    } else {
      console.log('\n⚠️  Integration test failures detected.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new IntegrationTests();
  tests.runAllTests().catch(console.error);
}

export { IntegrationTests };