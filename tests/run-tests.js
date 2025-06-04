#!/usr/bin/env node

/**
 * Test Runner for Deployment System
 * Runs all unit and integration tests
 */

import { DeploymentTests } from './deployment.test.js';
import { IntegrationTests } from './integration.test.js';

async function runAllTests() {
  console.log('🧪 Starting Deployment System Test Suite\n');
  
  let totalPassed = 0;
  let totalFailed = 0;

  try {
    // Run unit tests
    console.log('📋 Running Unit Tests...');
    const unitTests = new DeploymentTests();
    await unitTests.runAllTests();
    
    const unitResults = unitTests.testResults;
    const unitPassed = unitResults.filter(t => t.status === 'PASS').length;
    const unitFailed = unitResults.filter(t => t.status === 'FAIL').length;
    
    totalPassed += unitPassed;
    totalFailed += unitFailed;

    console.log('\n' + '='.repeat(60));
    
    // Run integration tests
    console.log('🔗 Running Integration Tests...');
    const integrationTests = new IntegrationTests();
    await integrationTests.runAllTests();
    
    const integrationResults = integrationTests.testResults;
    const integrationPassed = integrationResults.filter(t => t.status === 'PASS').length;
    const integrationFailures = integrationResults.filter(t => t.status === 'FAIL').length;
    
    totalPassed += integrationPassed;
    totalFailed += integrationFailures;

  } catch (error) {
    console.error('Test execution error:', error.message);
    process.exit(1);
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🏁 FINAL TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests Run: ${totalPassed + totalFailed}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Overall Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);

  if (totalFailed === 0) {
    console.log('\n✅ All tests passed! Deployment system is validated and ready.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Review failures before proceeding with deployment.');
    process.exit(1);
  }
}

runAllTests().catch(console.error);