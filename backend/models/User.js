// User model for database operations
import { query } from '../config/database.js';

class User {
  // Create a new user
  static async create(userData) {
    const { email, phone, whatsapp_phone, name, age } = userData;
    
    const result = await query(
      `INSERT INTO users (email, phone, whatsapp_phone, name, age) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [email, phone, whatsapp_phone, name, age]
    );
    
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  // Update user
  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    const result = await query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    return result.rows[0];
  }

  // Verify user email
  static async verifyEmail(id) {
    const result = await query(
      'UPDATE users SET email_verified = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }

  // Verify user phone
  static async verifyPhone(id) {
    const result = await query(
      'UPDATE users SET phone_verified = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }

  // Update last login
  static async updateLastLogin(id) {
    const result = await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }

  // Get user stats
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_weekly,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_monthly
      FROM users
    `);
    
    return result.rows[0];
  }

  // Delete user
  static async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    
    return result.rows[0];
  }
}

export default User;