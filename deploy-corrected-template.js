#!/usr/bin/env node

import https from 'https';
import fs from 'fs/promises';
import path from 'path';

class TemplateDeployer {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.owner = 'tred-io';
    this.repo = 'brown-feed-store-v2';
  }

  async deployFromMainRepo() {
    console.log('📦 Collecting all template files from main repository...');
    const files = await this.collectAllFiles();
    
    console.log('🚀 Pushing corrected template to client repository...');
    await this.pushAllFiles(files);
    
    console.log('✅ Template deployment completed successfully!');
  }

  async collectAllFiles() {
    const files = {};
    
    // Root configuration files
    const rootFiles = [
      'package.json', 'package-lock.json', 'postcss.config.js', 
      'tailwind.config.ts', 'tsconfig.json', 'vite.config.ts',
      'components.json', 'vercel.json'
    ];
    
    for (const file of rootFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        files[file] = content;
      } catch (error) {
        console.log(`Skipping ${file}: not found`);
      }
    }
    
    // Collect all directories
    await this.addDirectoryFiles(files, 'api', 'api');
    await this.addDirectoryFiles(files, 'server', 'server');
    await this.addDirectoryFiles(files, 'shared', 'shared');
    await this.addDirectoryFiles(files, 'client', 'client');
    
    return files;
  }
  
  async addDirectoryFiles(files, dirPath, prefix) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(prefix, entry.name);
        
        if (entry.isDirectory()) {
          await this.addDirectoryFiles(files, fullPath, relativePath);
        } else {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            files[relativePath] = content;
          } catch (error) {
            console.log(`Skipping ${fullPath}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`Directory ${dirPath} not found`);
    }
  }

  async pushAllFiles(files) {
    // First, get current repository state
    console.log('Getting current repository state...');
    const currentFiles = await this.getCurrentRepoFiles();
    
    // Update files in batches
    const fileEntries = Object.entries(files);
    const batchSize = 5;
    
    for (let i = 0; i < fileEntries.length; i += batchSize) {
      const batch = fileEntries.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async ([filePath, content]) => {
        await this.updateFile(filePath, content, currentFiles[filePath]);
      }));
      
      console.log(`Updated ${Math.min(i + batchSize, fileEntries.length)} of ${fileEntries.length} files`);
    }
  }

  async getCurrentRepoFiles() {
    try {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.owner}/${this.repo}/git/trees/main?recursive=1`,
        method: 'GET',
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'Template Deployer'
        }
      };

      const response = await this.makeRequest(options);
      const files = {};
      
      if (response.tree) {
        for (const item of response.tree) {
          if (item.type === 'blob') {
            files[item.path] = item.sha;
          }
        }
      }
      
      return files;
    } catch (error) {
      console.log('Could not get current repo state, proceeding with fresh deployment');
      return {};
    }
  }

  async updateFile(filePath, content, existingSha = null) {
    try {
      const data = {
        message: `Update ${filePath} from main template`,
        content: Buffer.from(content).toString('base64')
      };

      if (existingSha) {
        data.sha = existingSha;
      }

      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'Template Deployer',
          'Content-Type': 'application/json'
        }
      };

      await this.makeRequest(options, JSON.stringify(data));
    } catch (error) {
      if (!error.message.includes('422')) {
        console.log(`Failed to update ${filePath}: ${error.message}`);
      }
    }
  }

  makeRequest(options, data = null) {
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

const deployer = new TemplateDeployer();
deployer.deployFromMainRepo().catch(console.error);