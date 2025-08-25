// Database configuration and connection pool
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection configuration
let dbConfig;

if (process.env.NODE_ENV === 'production') {
  // Production: Use internal Railway connection
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  // Development: Use external Railway connection or local database
  const externalDbUrl = process.env.EXTERNAL_DATABASE_URL || constructExternalUrl();
  
  dbConfig = {
    connectionString: externalDbUrl,
    ssl: { rejectUnauthorized: false }, // Railway requires SSL
    max: 5, // Fewer connections for development
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000, // Longer timeout for external connections
  };
}

// Construct external DATABASE_URL from individual components
function constructExternalUrl() {
  // Check if we have a public DATABASE_URL for external access
  if (process.env.DATABASE_PUBLIC_URL) {
    console.log('🔗 Using DATABASE_PUBLIC_URL for external connection');
    return process.env.DATABASE_PUBLIC_URL;
  }
  
  const host = process.env.PGHOST;
  const port = process.env.PGPORT || '5432';
  const user = process.env.PGUSER || 'postgres';
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE || 'railway';
  
  if (!host || !password) {
    console.log('⚠️ Missing database connection details - using fallback storage');
    return null;
  }
  
  // For local development, we can't use .railway.internal hosts
  if (host.includes('railway.internal')) {
    console.log('⚠️ Cannot connect to internal Railway host from local development');
    console.log('💡 Either deploy to Railway or set up a local PostgreSQL database');
    return null;
  }
  
  const externalUrl = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  console.log('🔗 Using external database URL:', externalUrl.replace(password, '***'));
  return externalUrl;
}

// Create connection pool (with fallback for null config)
let pool;
if (dbConfig && dbConfig.connectionString) {
  pool = new Pool(dbConfig);
} else {
  console.log('⚠️ No valid database configuration - using fallback storage mode');
  // Create a dummy pool that will always fail gracefully
  pool = {
    query: () => Promise.reject(new Error('Database not available - using fallback storage')),
    connect: () => Promise.reject(new Error('Database not available - using fallback storage'))
  };
}

// Handle pool errors (only for real pools)
if (pool && typeof pool.on === 'function') {
  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client:', err);
    // Don't exit the process - let the application handle the error
  });
}

// Test database connection and auto-initialize if needed
async function testConnection() {
  try {
    if (!pool || typeof pool.connect !== 'function') {
      console.log('⚠️ Database pool not available - skipping connection test');
      return false;
    }
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    
    // Auto-initialize database tables if they don't exist
    await autoInitializeTables(client);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Will use fallback storage for this session');
    return false;
  }
}

// Automatically create tables if they don't exist
async function autoInitializeTables(client) {
  try {
    console.log('🔍 Checking database table status...');
    
    // Check if tables exist
    const tablesCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'quiz_results', 'ai_training_sessions')
    `);
    
    const existingTables = tablesCheck.rows.map(row => row.table_name);
    console.log('📋 Existing tables:', existingTables);
    
    if (tablesCheck.rows.length < 3) {
      console.log('🚀 Creating missing database tables...');
      
      // Create all tables automatically
      await client.query(`
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          whatsapp_phone VARCHAR(20),
          name VARCHAR(255),
          age INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          email_verified BOOLEAN DEFAULT FALSE,
          phone_verified BOOLEAN DEFAULT FALSE,
          last_login TIMESTAMP WITH TIME ZONE
        );

        -- Create quiz_results table
        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          answers JSONB NOT NULL,
          risk_score INTEGER,
          risk_level VARCHAR(50),
          recommendations JSONB,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create ai_training_sessions table
        CREATE TABLE IF NOT EXISTS ai_training_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          avatar_id VARCHAR(100) NOT NULL,
          customer_id VARCHAR(100),
          scenario VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'running',
          messages JSONB DEFAULT '[]',
          performance_metrics JSONB DEFAULT '{}',
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          duration INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON quiz_results(session_id);
        CREATE INDEX IF NOT EXISTS idx_ai_training_sessions_session_id ON ai_training_sessions(session_id);
      `);
      
      console.log('✅ Database tables auto-initialized successfully!');
    } else {
      console.log('✅ Database tables already exist - ready to go!');
    }
  } catch (error) {
    console.log('⚠️ Auto-initialization failed - using fallback storage:', error.message);
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