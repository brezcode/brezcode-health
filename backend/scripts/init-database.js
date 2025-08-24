// Database initialization script
import { query, testConnection } from '../config/database.js';

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connection');
    throw new Error('Database connection failed');
  }

  try {
    // Create users table
    await query(`
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
      )
    `);
    console.log('✅ Users table created/verified');

    // Create quiz_results table
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        answers JSONB NOT NULL,
        risk_score INTEGER,
        risk_level VARCHAR(50),
        recommendations JSONB,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Quiz results table created/verified');

    // Create ai_training_sessions table
    await query(`
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
      )
    `);
    console.log('✅ AI training sessions table created/verified');

    // Create health_reports table
    await query(`
      CREATE TABLE IF NOT EXISTS health_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quiz_result_id INTEGER REFERENCES quiz_results(id) ON DELETE CASCADE,
        report_data JSONB NOT NULL,
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        accessed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Health reports table created/verified');

    // Create user_preferences table
    await query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        notification_preferences JSONB DEFAULT '{}',
        health_goals JSONB DEFAULT '[]',
        reminder_settings JSONB DEFAULT '{}',
        privacy_settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ User preferences table created/verified');

    // Create indexes for performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON quiz_results(session_id);
      CREATE INDEX IF NOT EXISTS idx_ai_training_sessions_session_id ON ai_training_sessions(session_id);
      CREATE INDEX IF NOT EXISTS idx_ai_training_sessions_avatar_id ON ai_training_sessions(avatar_id);
      CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
    `);
    console.log('✅ Database indexes created/verified');

    // Create updated_at trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at columns
    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
      DROP TRIGGER IF EXISTS update_ai_training_sessions_updated_at ON ai_training_sessions;
      CREATE TRIGGER update_ai_training_sessions_updated_at 
        BEFORE UPDATE ON ai_training_sessions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
      DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
      CREATE TRIGGER update_user_preferences_updated_at 
        BEFORE UPDATE ON user_preferences 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Database triggers created/verified');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Run initialization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { initializeDatabase };