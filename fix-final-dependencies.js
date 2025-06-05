#!/usr/bin/env node

import https from 'https';

async function updateGitHubPackageJson() {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'tred-io';
  const repo = 'brown-feed-store';
  const path = 'package.json';

  try {
    const getOptions = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Node.js Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const currentFile = await makeRequest(getOptions);
    const content = Buffer.from(currentFile.content, 'base64').toString();
    
    const packageObj = JSON.parse(content);
    
    // Packages that must be in dependencies for Vercel builds
    const buildTimeDeps = [
      'vite',
      'esbuild', 
      'tsx',
      'typescript',
      'autoprefixer',
      'postcss',
      'tailwindcss',
      '@tailwindcss/typography',
      '@tailwindcss/vite',
      'tailwindcss-animate'
    ];
    
    // Move build-time dependencies from devDependencies to dependencies
    buildTimeDeps.forEach(dep => {
      if (packageObj.devDependencies && packageObj.devDependencies[dep]) {
        packageObj.dependencies[dep] = packageObj.devDependencies[dep];
        delete packageObj.devDependencies[dep];
      }
    });
    
    // Add missing dependencies that are required but not present
    const requiredDeps = {
      'tailwindcss-animate': '^1.0.7'
    };
    
    Object.entries(requiredDeps).forEach(([dep, version]) => {
      if (!packageObj.dependencies[dep]) {
        packageObj.dependencies[dep] = version;
      }
    });
    
    const fixedContent = JSON.stringify(packageObj, null, 2);

    const updateOptions = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Node.js Script',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const updateData = {
      message: 'Fix: Move all build-time dependencies to dependencies for Vercel',
      content: Buffer.from(fixedContent).toString('base64'),
      sha: currentFile.sha
    };

    const result = await makeRequest(updateOptions, JSON.stringify(updateData));
    console.log('Successfully organized all build dependencies for Vercel');
    console.log('New commit SHA:', result.commit.sha);
    
  } catch (error) {
    console.error('Error updating GitHub:', error.message);
  }
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`GitHub API error: ${res.statusCode} - ${parsed.message}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

updateGitHubPackageJson();