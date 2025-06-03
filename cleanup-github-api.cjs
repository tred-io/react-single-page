#!/usr/bin/env node

// Direct GitHub API cleanup script
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_WITH_DELETE;

if (!GITHUB_TOKEN) {
  console.log('❌ PERSONAL_ACCESS_TOKEN environment variable not found');
  process.exit(1);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'cleanup-script'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ data: parsed, status: res.statusCode });
        } catch (e) {
          resolve({ body, status: res.statusCode });
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

async function listRepositories() {
  try {
    const response = await makeRequest('/user/repos?per_page=100');
    return response.data || [];
  } catch (error) {
    console.log('❌ Error listing repositories:', error.message);
    return [];
  }
}

async function deleteRepository(owner, repo) {
  try {
    const response = await makeRequest(`/repos/${owner}/${repo}`, 'DELETE');
    if (response.status === 204) {
      console.log(`✅ Deleted: ${repo}`);
      return true;
    } else {
      console.log(`❌ Failed to delete ${repo}: HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to delete ${repo}:`, error.message);
    return false;
  }
}

async function cleanup() {
  console.log('🧹 Fetching GitHub repositories...');
  
  const repos = await listRepositories();
  
  if (repos.length === 0) {
    console.log('✅ No repositories found or unable to fetch repositories');
    return;
  }

  // Show all tred-io repositories to identify test ones
  const tredIoRepos = repos.filter(repo => repo.owner.login === 'tred-io');
  
  console.log(`📋 All tred-io repositories:`);
  tredIoRepos.forEach(repo => console.log(`  - ${repo.name}`));
  console.log('');
  
  // Filter for test repositories
  const testRepos = repos.filter(repo => {
    const name = repo.name.toLowerCase();
    const isOwnedByTredIo = repo.owner.login === 'tred-io';
    const isTestRepo = (
      name.includes('brown-feed') ||
      /^b[0-9]+-website$/.test(name) ||
      name === 'react-single-page' ||
      name.includes('test') ||
      name.includes('deploy')
    );
    
    // Exclude main repository and important ones - CRITICAL: DO NOT DELETE THESE
    const isMainRepo = name === 'sp-upholstery-template' || 
                      name === 'react-single-page' ||  // MAIN REPOSITORY - DO NOT DELETE
                      name === 'main' || 
                      name === 'template' ||
                      name === 'production' ||
                      !name.includes('test') && !name.includes('brown-feed') && !/^b[0-9]+-website$/.test(name);
    
    return isOwnedByTredIo && isTestRepo && !isMainRepo;
  });

  console.log(`📋 Found ${repos.length} total repositories`);
  console.log(`🧪 Found ${testRepos.length} test repositories:`);
  
  if (testRepos.length === 0) {
    console.log('✅ No test repositories to clean up');
    return;
  }

  testRepos.forEach(repo => console.log(`  - ${repo.name} (${repo.full_name})`));
  
  console.log('\n⚠️  This will delete the test repositories listed above.');
  console.log('The main repository will NOT be touched.');
  
  // Auto-confirm in CI environment
  if (process.env.AUTO_CONFIRM) {
    console.log('🗑️  Auto-confirming deletion...');
    await performDeletion(testRepos);
  } else {
    console.log('Set AUTO_CONFIRM=true to proceed with deletion');
  }
}

async function performDeletion(repos) {
  console.log('🗑️  Deleting test repositories...');
  
  let deleted = 0;
  for (const repo of repos) {
    const success = await deleteRepository(repo.owner.login, repo.name);
    if (success) deleted++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`✅ Cleanup complete! Deleted ${deleted}/${repos.length} repositories`);
}

cleanup().catch(error => {
  console.log('❌ Cleanup failed:', error.message);
  process.exit(1);
});