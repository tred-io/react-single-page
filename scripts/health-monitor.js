#!/usr/bin/env node

/**
 * Health Monitoring System for Canary Deployments
 * Monitors client sites during canary rollouts
 */

import https from 'https';
import http from 'http';
import fs from 'fs';

class HealthMonitor {
  constructor() {
    this.healthThreshold = 95; // 95% health required
    this.monitoringInterval = 60000; // 1 minute
  }

  async checkSiteHealth(domain) {
    const checks = await Promise.all([
      this.checkEndpoint(domain, '/'),
      this.checkEndpoint(domain, '/api/store-settings'),
      this.checkEndpoint(domain, '/admin')
    ]);

    const healthyChecks = checks.filter(check => check.healthy).length;
    const healthPercent = (healthyChecks / checks.length) * 100;

    return {
      domain,
      healthy: healthPercent >= this.healthThreshold,
      healthPercent,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  async checkEndpoint(domain, path) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const protocol = domain.includes('localhost') ? http : https;
      const port = domain.includes('localhost') ? 5000 : 443;
      
      const options = {
        hostname: domain.replace('http://', '').replace('https://', ''),
        port,
        path,
        method: 'GET',
        timeout: 5000
      };

      const req = protocol.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        const healthy = res.statusCode < 400;
        
        resolve({
          path,
          healthy,
          statusCode: res.statusCode,
          responseTime
        });
      });

      req.on('error', () => {
        resolve({
          path,
          healthy: false,
          statusCode: 0,
          responseTime: Date.now() - startTime,
          error: 'Connection failed'
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          path,
          healthy: false,
          statusCode: 0,
          responseTime: 5000,
          error: 'Timeout'
        });
      });

      req.setTimeout(5000);
      req.end();
    });
  }

  async monitorCanaryGroup(clients, durationMinutes = 10) {
    console.log(`Starting canary health monitoring for ${durationMinutes} minutes`);
    console.log(`Monitoring ${clients.length} clients: ${clients.join(', ')}`);
    console.log(`Health threshold: ${this.healthThreshold}%\n`);

    const endTime = Date.now() + (durationMinutes * 60000);
    let minute = 1;

    while (Date.now() < endTime) {
      console.log(`Minute ${minute}/${durationMinutes}:`);
      
      const results = await Promise.all(
        clients.map(client => this.checkSiteHealth(client))
      );

      const healthyClients = results.filter(r => r.healthy).length;
      const overallHealth = (healthyClients / clients.length) * 100;

      results.forEach(result => {
        const status = result.healthy ? '✓' : '✗';
        console.log(`  ${status} ${result.domain}: ${result.healthPercent.toFixed(1)}%`);
      });

      console.log(`  Overall: ${overallHealth.toFixed(1)}% (${healthyClients}/${clients.length} healthy)\n`);

      if (overallHealth < this.healthThreshold) {
        console.log(`❌ CANARY HEALTH CHECK FAILED`);
        console.log(`Health dropped below ${this.healthThreshold}% threshold`);
        console.log(`Recommendation: Abort deployment and investigate`);
        
        return {
          success: false,
          finalHealth: overallHealth,
          failedAt: minute,
          results
        };
      }

      if (Date.now() < endTime) {
        minute++;
        await new Promise(resolve => setTimeout(resolve, this.monitoringInterval));
      }
    }

    console.log(`✅ CANARY MONITORING COMPLETE`);
    console.log(`All health checks passed for ${durationMinutes} minutes`);
    console.log(`Safe to proceed with full deployment\n`);

    return {
      success: true,
      finalHealth: (results.filter(r => r.healthy).length / clients.length) * 100
    };
  }

  getClientList() {
    try {
      const deployments = fs.readdirSync('deployments')
        .filter(dir => fs.statSync(`deployments/${dir}`).isDirectory())
        .map(client => {
          try {
            const config = JSON.parse(fs.readFileSync(`deployments/${client}/client-config.json`, 'utf8'));
            return config.domain || `${client}.vercel.app`;
          } catch {
            return `${client}.vercel.app`;
          }
        });
      
      return deployments;
    } catch {
      return ['localhost:5000']; // Fallback to local testing
    }
  }
}

// Demonstration functions
async function demonstrateCanaryMonitoring() {
  const monitor = new HealthMonitor();
  const allClients = monitor.getClientList();
  
  if (allClients.length === 0) {
    console.log('No client deployments found for monitoring');
    return;
  }

  // Select 20% for canary (minimum 1)
  const canaryCount = Math.max(1, Math.ceil(allClients.length * 0.2));
  const canaryClients = allClients.slice(0, canaryCount);

  console.log('🐤 CANARY DEPLOYMENT HEALTH MONITORING');
  console.log('=====================================\n');
  
  console.log(`Total clients: ${allClients.length}`);
  console.log(`Canary group: ${canaryCount} clients (${(canaryCount/allClients.length*100).toFixed(1)}%)`);
  console.log(`Production clients protected: ${allClients.length - canaryCount}\n`);

  // Run monitoring (shortened for demo)
  const result = await monitor.monitorCanaryGroup(canaryClients, 2);
  
  if (result.success) {
    console.log('🚀 READY FOR FULL DEPLOYMENT');
    console.log(`Remaining clients to deploy: ${allClients.length - canaryCount}`);
  } else {
    console.log('🛑 DEPLOYMENT ABORTED');
    console.log('Protected clients from potential issues');
  }
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'monitor':
      await demonstrateCanaryMonitoring();
      break;
    case 'check':
      const domain = process.argv[3] || 'localhost';
      const monitor = new HealthMonitor();
      const result = await monitor.checkSiteHealth(domain);
      console.log(JSON.stringify(result, null, 2));
      break;
    default:
      console.log('Usage:');
      console.log('  node health-monitor.js monitor    # Run canary monitoring demo');
      console.log('  node health-monitor.js check [domain]  # Check single site');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { HealthMonitor };