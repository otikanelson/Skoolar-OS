require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    const client = await pool.connect();
    console.log('✓ Connected to database successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✓ Query executed:', result.rows[0]);
    
    client.release();
    await pool.end();
    
    console.log('✓ Connection test passed!');
  } catch (error) {
    console.error('✗ Connection test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
