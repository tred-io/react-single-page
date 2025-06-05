// Client API Entry Point
// This file references the main template and loads client-specific configuration

import { resolve } from 'path';

// Set client configuration path for the template
process.env.CLIENT_CONFIG_PATH = resolve(__dirname, '../client-config.json');
process.env.CLIENT_NAME = 'brown-feed-store';

// Import and export the main template handler
export { default } from '../../../api/index';
