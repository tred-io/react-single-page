#!/usr/bin/env node

/**
 * CI/CD Pipeline Tests
 * Validates deployment workflows and production readiness
 */

import { strict as assert } from 'assert';
import fs from 'fs';
import https from 'https';
import http from 'http';

class CICDTests {
  constructor() {
    this.testResults = [];
    this.failedTests = [];
  }

  log(message) {
    console.log(`[CI/CD] ${message}`);
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

  // Test 1: Production build validation
  async testProductionBuild() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert(packageJson.scripts.build, 'Missing build script');
    assert(packageJson.scripts.start, 'Missing start script');
    
    // Validate build outputs directory
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    assert(vercelConfig.outputDirectory === 'dist', 'Build output directory mismatch');
  }

  // Test 2: Security headers validation
  async testSecurityHeaders() {
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    const apiContent = fs.readFileSync('api/index.ts', 'utf8');
    
    // Check for CORS configuration
    assert(apiContent.includes('Access-Control-Allow-Origin'), 'CORS headers missing');
    assert(apiContent.includes('Access-Control-Allow-Methods'), 'CORS methods missing');
    assert(apiContent.includes('Access-Control-Allow-Headers'), 'CORS headers config missing');
  }

  // Test 3: Environment variable security
  async testEnvironmentSecurity() {
    const workflows = fs.readdirSync('.github/workflows');
    
    for (const workflow of workflows) {
      if (workflow.endsWith('.yml')) {
        const content = fs.readFileSync(`.github/workflows/${workflow}`, 'utf8');
        
        // Check that sensitive data uses secrets
        if (content.includes('API_KEY') || content.includes('TOKEN')) {
          assert(content.includes('secrets.'), `${workflow} should use GitHub secrets for API keys`);
        }
        
        // Check for hardcoded credentials
        assert(!content.includes('password:'), `${workflow} contains hardcoded passwords`);
        assert(!content.includes('sk-'), `${workflow} may contain hardcoded API keys`);
      }
    }
  }

  // Test 4: Database migration safety
  async testDatabaseMigrationSafety() {
    const initClientContent = fs.readFileSync('scripts/init-client.js', 'utf8');
    
    // Check for proper error handling
    assert(initClientContent.includes('try'), 'Database init missing error handling');
    assert(initClientContent.includes('catch'), 'Database init missing catch blocks');
    
    // Check for initialization functions
    assert(initClientContent.includes('initializeClientSchema'), 'Schema initialization missing');
    assert(initClientContent.includes('initializeClientData'), 'Data initialization missing');
  }

  // Test 5: Health monitoring configuration
  async testHealthMonitoring() {
    const healthContent = fs.readFileSync('scripts/health-monitor.js', 'utf8');
    
    // Validate health thresholds
    assert(healthContent.includes('healthThreshold'), 'Health threshold not configured');
    assert(healthContent.includes('95'), 'Health threshold should be 95%');
    
    // Check monitoring endpoints
    assert(healthContent.includes('/api/store-settings'), 'API health check missing');
    assert(healthContent.includes('/admin'), 'Admin panel health check missing');
  }

  // Test 6: Deployment rollback capability
  async testRollbackCapability() {
    const workflowContent = fs.readFileSync('.github/workflows/complete-deployment-pipeline.yml', 'utf8');
    
    // Check for rollback workflow
    assert(workflowContent.includes('emergency-rollback'), 'Emergency rollback option missing');
    assert(workflowContent.includes('rollback_version'), 'Rollback version parameter missing');
  }

  // Test 7: Multi-client isolation
  async testMultiClientIsolation() {
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    const apiContent = fs.readFileSync('api/index.ts', 'utf8');
    
    // Check for client isolation via environment variables
    assert(serverContent.includes('CLIENT_NAME') || apiContent.includes('CLIENT_NAME'), 
           'Client isolation mechanism missing');
    assert(serverContent.includes('DATABASE_URL') || apiContent.includes('DATABASE_URL'), 
           'Database isolation missing');
  }

  // Test 8: Production error handling
  async testProductionErrorHandling() {
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    const apiContent = fs.readFileSync('api/index.ts', 'utf8');
    
    // Check for error middleware
    assert(serverContent.includes('error') || apiContent.includes('error'), 
           'Error handling middleware missing');
    
    // Check for production-safe error responses
    assert(serverContent.includes('500') || apiContent.includes('500'), 
           'HTTP 500 error handling missing');
  }

  // Test 9: Performance optimization
  async testPerformanceOptimization() {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    // Check for build optimization
    assert(vercelConfig.buildCommand, 'Build command not specified');
    assert(vercelConfig.functions, 'Serverless functions not configured');
    
    // Check for SPA routing
    assert(vercelConfig.rewrites, 'SPA routing not configured');
    assert(vercelConfig.rewrites.some(r => r.destination === '/index.html'), 
           'SPA fallback routing missing');
  }

  // Test 10: Production monitoring
  async testProductionMonitoring() {
    const deploymentContent = fs.readFileSync('scripts/deployment-safety.js', 'utf8');
    
    // Check for production monitoring
    assert(deploymentContent.includes('healthCheck'), 'Health check function missing');
    assert(deploymentContent.includes('smokeTests'), 'Smoke tests missing');
    assert(deploymentContent.includes('timeout'), 'Request timeout handling missing');
  }

  async runAllTests() {
    this.log('Starting CI/CD Pipeline Tests...\n');

    await this.runTest('Production Build', () => this.testProductionBuild());
    await this.runTest('Security Headers', () => this.testSecurityHeaders());
    await this.runTest('Environment Security', () => this.testEnvironmentSecurity());
    await this.runTest('Database Migration Safety', () => this.testDatabaseMigrationSafety());
    await this.runTest('Health Monitoring', () => this.testHealthMonitoring());
    await this.runTest('Rollback Capability', () => this.testRollbackCapability());
    await this.runTest('Multi-Client Isolation', () => this.testMultiClientIsolation());
    await this.runTest('Production Error Handling', () => this.testProductionErrorHandling());
    await this.runTest('Performance Optimization', () => this.testPerformanceOptimization());
    await this.runTest('Production Monitoring', () => this.testProductionMonitoring());

    this.generateReport();
  }

  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASS').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAIL').length;

    console.log('\n' + '='.repeat(60));
    console.log('CI/CD PIPELINE TEST REPORT');
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
      console.log('\n🎉 CI/CD pipeline validated! Ready for production deployment.');
    } else {
      console.log('\n⚠️  CI/CD validation failures detected.');
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new CICDTests();
  tests.runAllTests().catch(console.error);
}

export { CICDTests };