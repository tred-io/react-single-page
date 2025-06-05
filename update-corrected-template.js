#!/usr/bin/env node

import https from 'https';

async function updateGitHubFiles() {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'tred-io';
  const repo = 'brown-feed-store-v2';
  
  // Update postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await updateFile('postcss.config.js', postcssConfig, 'Fix: Revert to Tailwind CSS v3 PostCSS configuration');
  
  // Update package.json to ensure correct dependencies
  const packageJson = await getFile('package.json');
  const packageObj = JSON.parse(Buffer.from(packageJson.content, 'base64').toString());
  
  // Ensure build-time dependencies are in dependencies, not devDependencies
  const buildDeps = ['tailwindcss', 'autoprefixer', 'postcss', 'vite', 'esbuild', 'tsx', 'typescript'];
  
  buildDeps.forEach(dep => {
    if (packageObj.devDependencies && packageObj.devDependencies[dep]) {
      packageObj.dependencies[dep] = packageObj.devDependencies[dep];
      delete packageObj.devDependencies[dep];
    }
  });
  
  // Ensure stable Tailwind CSS v3 version
  packageObj.dependencies.tailwindcss = '^3.4.17';
  
  await updateFile('package.json', JSON.stringify(packageObj, null, 2), 'Fix: Ensure stable Tailwind CSS v3 and correct dependency organization', packageJson.sha);
  
  console.log('✅ Template configuration corrected');

  async function getFile(path) {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repo}/contents/${path}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'Template Updater'
      }
    };
    
    return makeRequest(options);
  }

  async function updateFile(path, content, message, sha = null) {
    try {
      if (!sha) {
        const currentFile = await getFile(path);
        sha = currentFile.sha;
      }

      const options = {
        hostname: 'api.github.com',
        path: `/repos/${owner}/${repo}/contents/${path}`,
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'Template Updater',
          'Content-Type': 'application/json'
        }
      };

      const data = {
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      };

      await makeRequest(options, JSON.stringify(data));
      console.log(`Updated ${path}`);
    } catch (error) {
      console.log(`Failed to update ${path}: ${error.message}`);
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
}

updateGitHubFiles().catch(console.error);