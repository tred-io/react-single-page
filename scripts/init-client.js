#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Get command line arguments
const [,, clientName, domain] = process.argv;

if (!clientName || !domain) {
  console.error('Usage: node init-client.js <client-name> <domain>');
  process.exit(1);
}

async function main() {
  try {
    // Import the initialization functions from the built distribution
    const { initializeClientSchema, initializeClientData } = await import('../dist/index.js');
    
    console.log(`Initializing schema for client: ${clientName}`);
    const schemaResult = await initializeClientSchema(clientName);
    
    if (schemaResult) {
      console.log(`Initializing data for client: ${clientName}`);
      const dataResult = await initializeClientData(clientName, domain);
      
      if (dataResult) {
        console.log('Client initialization completed successfully');
      } else {
        console.error('Failed to initialize client data');
        process.exit(1);
      }
    } else {
      console.error('Failed to initialize client schema');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during client initialization:', error);
    process.exit(1);
  }
}

main();