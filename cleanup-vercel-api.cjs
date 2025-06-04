#!/usr/bin/env node

// Direct Vercel API cleanup script
const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'tred-io';

if (!VERCEL_TOKEN) {
  console.log('❌ VERCEL_TOKEN environment variable not found');
  process.exit(1);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
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

async function listProjects() {
  try {
    const response = await makeRequest(`/v9/projects?teamId=${TEAM_ID}`);
    return response.projects || [];
  } catch (error) {
    console.log('❌ Error listing projects:', error.message);
    return [];
  }
}

async function deleteProject(projectId, projectName) {
  try {
    await makeRequest(`/v9/projects/${projectId}?teamId=${TEAM_ID}`, 'DELETE');
    console.log(`✅ Deleted: ${projectName}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to delete ${projectName}:`, error.message);
    return false;
  }
}

async function cleanup() {
  console.log('🧹 Fetching Vercel projects...');
  
  const projects = await listProjects();
  
  if (projects.length === 0) {
    console.log('✅ No projects found or unable to fetch projects');
    return;
  }

  console.log(`📋 Found ${projects.length} projects:`);
  projects.forEach(p => console.log(`  - ${p.name} (${p.id})`));
  
  console.log('\n⚠️  This will delete ALL projects listed above.');
  console.log('Press Ctrl+C to cancel, or Enter to continue...');
  
  // In automated environment, we'll skip the prompt
  if (process.env.AUTO_CONFIRM) {
    console.log('🗑️  Auto-confirming deletion...');
  } else {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
      await performDeletion(projects);
    });
    return;
  }
  
  await performDeletion(projects);
}

async function performDeletion(projects) {
  console.log('🗑️  Deleting projects...');
  
  let deleted = 0;
  for (const project of projects) {
    const success = await deleteProject(project.id, project.name);
    if (success) deleted++;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ Cleanup complete! Deleted ${deleted}/${projects.length} projects`);
  process.exit(0);
}

cleanup().catch(error => {
  console.log('❌ Cleanup failed:', error.message);
  process.exit(1);
});