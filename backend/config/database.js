// Database configuration and connection pool
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err);
  // Don't exit the process - let the application handle the error
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
}

// Execute a query with error handling
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🗄️ Executed query:', { text: text.substring(0, 50) + '...', duration, rows: result.rowCount });
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    console.error('❌ Query error:', { text: text.substring(0, 50) + '...', duration, error: err.message });
    throw err;
  }
}

// Get a client from the pool for transactions
async function getClient() {
  return await pool.connect();
}

export {
  pool,
  query,
  getClient,
  testConnection
};