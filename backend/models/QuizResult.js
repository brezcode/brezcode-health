// QuizResult model for database operations
import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class QuizResult {
  // Create a new quiz result
  static async create(quizData) {
    const { user_id, answers, risk_score, risk_level, recommendations } = quizData;
    const session_id = uuidv4();
    
    const result = await query(
      `INSERT INTO quiz_results (user_id, session_id, answers, risk_score, risk_level, recommendations) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, session_id, JSON.stringify(answers), risk_score, risk_level, JSON.stringify(recommendations)]
    );
    
    return result.rows[0];
  }

  // Find quiz result by session ID
  static async findBySessionId(session_id) {
    const result = await query(
      'SELECT * FROM quiz_results WHERE session_id = $1',
      [session_id]
    );
    
    if (result.rows[0]) {
      // Parse JSON fields
      result.rows[0].answers = JSON.parse(result.rows[0].answers);
      result.rows[0].recommendations = JSON.parse(result.rows[0].recommendations);
    }
    
    return result.rows[0];
  }

  // Find quiz results by user ID
  static async findByUserId(user_id) {
    const result = await query(
      'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    
    return result.rows.map(row => ({
      ...row,
      answers: JSON.parse(row.answers),
      recommendations: JSON.parse(row.recommendations)
    }));
  }

  // Get user's latest quiz result
  static async getLatestByUserId(user_id) {
    const result = await query(
      'SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [user_id]
    );
    
    if (result.rows[0]) {
      result.rows[0].answers = JSON.parse(result.rows[0].answers);
      result.rows[0].recommendations = JSON.parse(result.rows[0].recommendations);
    }
    
    return result.rows[0];
  }

  // Update quiz result
  static async update(session_id, updateData) {
    const { risk_score, risk_level, recommendations } = updateData;
    
    const result = await query(
      `UPDATE quiz_results 
       SET risk_score = COALESCE($2, risk_score),
           risk_level = COALESCE($3, risk_level),
           recommendations = COALESCE($4, recommendations)
       WHERE session_id = $1 
       RETURNING *`,
      [session_id, risk_score, risk_level, recommendations ? JSON.stringify(recommendations) : null]
    );
    
    if (result.rows[0]) {
      result.rows[0].answers = JSON.parse(result.rows[0].answers);
      result.rows[0].recommendations = JSON.parse(result.rows[0].recommendations);
    }
    
    return result.rows[0];
  }

  // Get quiz statistics
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_quizzes,
        AVG(risk_score) as average_risk_score,
        COUNT(*) FILTER (WHERE risk_level = 'low') as low_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'moderate') as moderate_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'high') as high_risk_count,
        COUNT(*) FILTER (WHERE completed_at > NOW() - INTERVAL '7 days') as completed_this_week
      FROM quiz_results
    `);
    
    return result.rows[0];
  }

  // Get risk level distribution
  static async getRiskDistribution() {
    const result = await query(`
      SELECT 
        risk_level,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
      FROM quiz_results 
      WHERE risk_level IS NOT NULL
      GROUP BY risk_level
      ORDER BY count DESC
    `);
    
    return result.rows;
  }

  // Delete quiz result
  static async delete(session_id) {
    const result = await query(
      'DELETE FROM quiz_results WHERE session_id = $1 RETURNING *',
      [session_id]
    );
    
    return result.rows[0];
  }
}

export default QuizResult;