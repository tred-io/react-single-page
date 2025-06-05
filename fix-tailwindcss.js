#!/usr/bin/env node

import https from 'https';

async function updateGitHubPackageJson() {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'tred-io';
  const repo = 'brown-feed-store';
  const path = 'package.json';

  try {
    // Get current package.json
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
    
    // Add tailwindcss and postcss to dependencies, remove autoprefixer duplicate
    const packageObj = JSON.parse(content);
    packageObj.dependencies = packageObj.dependencies || {};
    packageObj.dependencies.tailwindcss = "^3.4.17";
    packageObj.dependencies.postcss = "^8.4.47";
    
    // Remove autoprefixer from dependencies (keep it in devDependencies)
    delete packageObj.dependencies.autoprefixer;
    
    const fixedContent = JSON.stringify(packageObj, null, 2);

    // Update the file
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
      message: 'Fix: Add tailwindcss and postcss dependencies for build',
      content: Buffer.from(fixedContent).toString('base64'),
      sha: currentFile.sha
    };

    const result = await makeRequest(updateOptions, JSON.stringify(updateData));
    console.log('Successfully added tailwindcss and postcss to package.json on GitHub');
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