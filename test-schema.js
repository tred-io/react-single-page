// Quick test to verify schema creation works with your database
import { Pool } from '@neondatabase/serverless';

async function testSchemaCreation() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not found');
    return;
  }

  const client = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Test creating a schema
    const schemaName = 'sp_upholstery';
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    console.log(`✅ Schema '${schemaName}' created successfully`);
    
    // List existing schemas
    const result = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    `);
    
    console.log('📋 Existing schemas:', result.rows.map(r => r.schema_name));
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
  } finally {
    await client.end();
  }
}

testSchemaCreation();