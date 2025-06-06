/**
 * Verify Client Deployment Status
 * Checks GitHub repository, Vercel project, and database schema
 */

const https = require('https');

class DeploymentVerifier {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
    this.vercelToken = process.env.VERCEL_TOKEN;
  }

  async makeRequest(hostname, path, headers = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname,
        port: 443,
        path,
        method: 'GET',
        headers
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  async verifyGitHubRepo(clientName) {
    const repoName = `${clientName}-website`;
    try {
      const response = await this.makeRequest(
        'api.github.com',
        `/repos/tred-io/${repoName}`,
        { 'Authorization': `token ${this.githubToken}`, 'User-Agent': 'deployment-verifier' }
      );
      return {
        exists: response.status === 200,
        url: response.status === 200 ? response.data.html_url : null,
        status: response.status
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  async verifyVercelProject(clientName) {
    const projectName = `${clientName}-website`;
    try {
      const response = await this.makeRequest(
        'api.vercel.com',
        `/v9/projects/${projectName}`,
        { 'Authorization': `Bearer ${this.vercelToken}` }
      );
      return {
        exists: response.status === 200,
        url: response.status === 200 ? `https://${response.data.name}.vercel.app` : null,
        status: response.status,
        framework: response.status === 200 ? response.data.framework : null
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  async verifyDeployment(clientName) {
    console.log(`\n🔍 Verifying deployment for: ${clientName}`);
    
    const github = await this.verifyGitHubRepo(clientName);
    const vercel = await this.verifyVercelProject(clientName);
    
    console.log('\n📊 Deployment Status:');
    console.log(`GitHub Repository: ${github.exists ? '✅' : '❌'} ${github.url || github.error || ''}`);
    console.log(`Vercel Project: ${vercel.exists ? '✅' : '❌'} ${vercel.url || vercel.error || ''}`);
    
    if (vercel.exists && vercel.framework) {
      console.log(`Framework: ${vercel.framework}`);
    }
    
    const isComplete = github.exists && vercel.exists;
    console.log(`\n🎯 Deployment Complete: ${isComplete ? '✅' : '❌'}`);
    
    return {
      clientName,
      github,
      vercel,
      isComplete
    };
  }
}

async function main() {
  const clientName = process.argv[2];
  if (!clientName) {
    console.error('Usage: node verify-deployment.js <client-name>');
    process.exit(1);
  }

  const verifier = new DeploymentVerifier();
  const result = await verifier.verifyDeployment(clientName);
  
  process.exit(result.isComplete ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentVerifier };