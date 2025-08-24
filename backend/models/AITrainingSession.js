// AITrainingSession model for database operations
import { query } from '../config/database.js';

class AITrainingSession {
  // Create a new AI training session
  static async create(sessionData) {
    const { session_id, avatar_id, customer_id, scenario, performance_metrics } = sessionData;
    
    const result = await query(
      `INSERT INTO ai_training_sessions (session_id, avatar_id, customer_id, scenario, performance_metrics) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [session_id, avatar_id, customer_id, scenario, JSON.stringify(performance_metrics || {})]
    );
    
    if (result.rows[0]) {
      result.rows[0].messages = JSON.parse(result.rows[0].messages);
      result.rows[0].performance_metrics = JSON.parse(result.rows[0].performance_metrics);
    }
    
    return result.rows[0];
  }

  // Find session by session ID
  static async findBySessionId(session_id) {
    const result = await query(
      'SELECT * FROM ai_training_sessions WHERE session_id = $1',
      [session_id]
    );
    
    if (result.rows[0]) {
      result.rows[0].messages = JSON.parse(result.rows[0].messages);
      result.rows[0].performance_metrics = JSON.parse(result.rows[0].performance_metrics);
    }
    
    return result.rows[0];
  }

  // Update session with new messages and metrics
  static async update(session_id, updateData) {
    const { messages, performance_metrics, status, completed_at, duration } = updateData;
    
    const result = await query(
      `UPDATE ai_training_sessions 
       SET messages = COALESCE($2, messages),
           performance_metrics = COALESCE($3, performance_metrics),
           status = COALESCE($4, status),
           completed_at = COALESCE($5, completed_at),
           duration = COALESCE($6, duration)
       WHERE session_id = $1 
       RETURNING *`,
      [
        session_id,
        messages ? JSON.stringify(messages) : null,
        performance_metrics ? JSON.stringify(performance_metrics) : null,
        status,
        completed_at,
        duration
      ]
    );
    
    if (result.rows[0]) {
      result.rows[0].messages = JSON.parse(result.rows[0].messages);
      result.rows[0].performance_metrics = JSON.parse(result.rows[0].performance_metrics);
    }
    
    return result.rows[0];
  }

  // Add message to session
  static async addMessage(session_id, message) {
    const session = await this.findBySessionId(session_id);
    if (!session) return null;
    
    const messages = session.messages || [];
    messages.push(message);
    
    return await this.update(session_id, { messages });
  }

  // Complete session
  static async complete(session_id, duration) {
    return await this.update(session_id, {
      status: 'completed',
      completed_at: new Date(),
      duration: duration
    });
  }

  // Get sessions by avatar ID
  static async findByAvatarId(avatar_id, limit = 10) {
    const result = await query(
      `SELECT * FROM ai_training_sessions 
       WHERE avatar_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [avatar_id, limit]
    );
    
    return result.rows.map(row => ({
      ...row,
      messages: JSON.parse(row.messages),
      performance_metrics: JSON.parse(row.performance_metrics)
    }));
  }

  // Get completed sessions for analysis
  static async getCompletedSessions(avatar_id) {
    const result = await query(
      `SELECT * FROM ai_training_sessions 
       WHERE avatar_id = $1 AND status = 'completed'
       ORDER BY completed_at DESC`,
      [avatar_id]
    );
    
    return result.rows.map(row => ({
      ...row,
      messages: JSON.parse(row.messages),
      performance_metrics: JSON.parse(row.performance_metrics)
    }));
  }

  // Get session statistics
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
        COUNT(*) FILTER (WHERE status = 'running') as active_sessions,
        AVG(duration) FILTER (WHERE duration > 0) as average_duration,
        COUNT(DISTINCT avatar_id) as unique_avatars
      FROM ai_training_sessions
    `);
    
    return result.rows[0];
  }

  // Get performance metrics summary
  static async getPerformanceStats(avatar_id = null) {
    const whereClause = avatar_id ? 'WHERE avatar_id = $1 AND' : 'WHERE';
    const params = avatar_id ? [avatar_id] : [];
    
    const result = await query(`
      SELECT 
        COUNT(*) as session_count,
        AVG((performance_metrics->>'response_quality')::numeric) as avg_response_quality,
        AVG((performance_metrics->>'customer_satisfaction')::numeric) as avg_customer_satisfaction,
        AVG((performance_metrics->>'goal_achievement')::numeric) as avg_goal_achievement,
        AVG((performance_metrics->>'conversation_flow')::numeric) as avg_conversation_flow
      FROM ai_training_sessions 
      ${whereClause} status = 'completed' AND performance_metrics IS NOT NULL
    `, params);
    
    return result.rows[0];
  }

  // Delete session
  static async delete(session_id) {
    const result = await query(
      'DELETE FROM ai_training_sessions WHERE session_id = $1 RETURNING *',
      [session_id]
    );
    
    return result.rows[0];
  }

  // Clean up old running sessions (mark as abandoned)
  static async cleanupAbandonedSessions(hoursThreshold = 24) {
    const result = await query(
      `UPDATE ai_training_sessions 
       SET status = 'abandoned' 
       WHERE status = 'running' 
       AND started_at < NOW() - INTERVAL '${hoursThreshold} hours'
       RETURNING session_id`,
    );
    
    return result.rows;
  }
}

export default AITrainingSession;