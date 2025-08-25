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

// Test database connection and auto-initialize if needed
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    
    // Auto-initialize database tables if they don't exist
    await autoInitializeTables(client);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
}

// Automatically create tables if they don't exist
async function autoInitializeTables(client) {
  try {
    // Check if tables exist
    const tablesCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'quiz_results', 'ai_training_sessions')
    `);
    
    if (tablesCheck.rows.length < 3) {
      console.log('🚀 Auto-initializing database tables...');
      
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