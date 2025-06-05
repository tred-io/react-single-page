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

  async deployTemplate() {
    console.log('📦 Collecting template files...');
    const files = await this.collectTemplateFiles();
    
    console.log('🚀 Pushing template to GitHub...');
    await this.pushToGitHub(files);
    
    console.log('✅ Template deployment completed!');
  }

  async collectTemplateFiles() {
    const files = {};
    const baseDir = '.';
    
    // Core application files
    const coreFiles = [
      'package.json',
      'package-lock.json',
      'postcss.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      'vite.config.ts',
      'components.json',
      'vercel.json',
      '.gitignore'
    ];
    
    for (const file of coreFiles) {
      try {
        const content = await fs.readFile(path.join(baseDir, file), 'utf8');
        files[file] = content;
      } catch (error) {
        console.log(`Skipping ${file}: ${error.message}`);
      }
    }
    
    // API files
    await this.addDirectoryFiles(files, 'api', 'api');
    
    // Server files
    await this.addDirectoryFiles(files, 'server', 'server');
    
    // Shared files
    await this.addDirectoryFiles(files, 'shared', 'shared');
    
    // Client files
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
      console.log(`Directory ${dirPath} not found: ${error.message}`);
    }
  }

  async pushToGitHub(files) {
    const fileEntries = Object.entries(files);
    const batchSize = 10;
    
    for (let i = 0; i < fileEntries.length; i += batchSize) {
      const batch = fileEntries.slice(i, i + batchSize);
      
      for (const [filePath, content] of batch) {
        await this.createOrUpdateFile(filePath, content);
      }
      
      console.log(`Pushed ${Math.min(i + batchSize, fileEntries.length)} of ${fileEntries.length} files`);
    }
  }

  async createOrUpdateFile(filePath, content) {
    try {
      const encodedContent = Buffer.from(content).toString('base64');
      
      const data = {
        message: `Add ${filePath}`,
        content: encodedContent
      };

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
      console.log(`Failed to upload ${filePath}: ${error.message}`);
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
deployer.deployTemplate().catch(console.error);