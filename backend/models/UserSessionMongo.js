// User Session Model - MongoDB with Mongoose
import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  // Unique Identifiers
  session_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  
  // User Information
  user_id: {
    type: String,
    required: true
  },
  
  // Session Data
  quiz_session_id: {
    type: String,
    required: true
  },
  
  current_step: {
    type: String,
    enum: ['quiz_completed', 'report_generated', 'dashboard_active', 'signup_completed'],
    default: 'quiz_completed'
  },
  
  // Activity Tracking
  last_activity: {
    type: Date,
    default: Date.now
  },
  
  ip_address: {
    type: String,
    default: 'unknown'
  },
  
  user_agent: {
    type: String,
    default: 'unknown'
  },
  
  // Session State
  is_active: {
    type: Boolean,
    default: true
  },
  
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
userSessionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Indexes for performance
userSessionSchema.index({ quiz_session_id: 1 });
userSessionSchema.index({ user_id: 1 });
userSessionSchema.index({ expires_at: 1 });
userSessionSchema.index({ is_active: 1 });

const UserSession = mongoose.model('UserSession', userSessionSchema);

// Service class for UserSession operations
export class UserSessionService {
  static async create(sessionData) {
    try {
      const session = new UserSession(sessionData);
      const savedSession = await session.save();
      console.log('✅ User session created:', savedSession.session_id);
      return savedSession;
    } catch (error) {
      console.error('❌ Error creating user session:', error);
      throw error;
    }
  }

  static async findByQuizSessionId(quiz_session_id) {
    try {
      const session = await UserSession.findOne({ 
        quiz_session_id: quiz_session_id,
        is_active: true,
        expires_at: { $gt: new Date() }
      });
      return session;
    } catch (error) {
      console.error('❌ Error finding session by quiz session ID:', error);
      throw error;
    }
  }

  static async findBySessionId(session_id) {
    try {
      const session = await UserSession.findOne({ 
        session_id: session_id,
        is_active: true,
        expires_at: { $gt: new Date() }
      });
      return session;
    } catch (error) {
      console.error('❌ Error finding session by session ID:', error);
      throw error;
    }
  }

  static async updateActivity(session_id, step = null) {
    try {
      const updateData = {
        last_activity: new Date(),
        updated_at: new Date()
      };
      
      if (step) {
        updateData.current_step = step;
      }

      const session = await UserSession.findOneAndUpdate(
        { session_id: session_id, is_active: true },
        updateData,
        { new: true }
      );
      return session;
    } catch (error) {
      console.error('❌ Error updating session activity:', error);
      throw error;
    }
  }

  static async deactivateSession(session_id) {
    try {
      const session = await UserSession.findOneAndUpdate(
        { session_id: session_id },
        { is_active: false, updated_at: new Date() },
        { new: true }
      );
      return session;
    } catch (error) {
      console.error('❌ Error deactivating session:', error);
      throw error;
    }
  }

  static async cleanExpiredSessions() {
    try {
      const result = await UserSession.updateMany(
        { expires_at: { $lt: new Date() } },
        { is_active: false, updated_at: new Date() }
      );
      console.log(`✅ Cleaned ${result.modifiedCount} expired sessions`);
      return result;
    } catch (error) {
      console.error('❌ Error cleaning expired sessions:', error);
      throw error;
    }
  }
}

export default UserSession;