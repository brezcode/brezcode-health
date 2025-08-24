// Database-integrated Avatar Training Session Service
// Uses PostgreSQL for persistent storage with in-memory fallback

import { ClaudeAvatarService } from './claudeAvatarService.js';
import AITrainingSession from '../models/AITrainingSession.js';
import { testConnection } from '../config/database.js';

let databaseAvailable = false;
let fallbackSessions = new Map();

// Initialize database connection
async function initializeDatabase() {
  try {
    databaseAvailable = await testConnection();
    if (databaseAvailable) {
      console.log('✅ Database Avatar Training Service: Connected to PostgreSQL');
      // Clean up abandoned sessions
      const abandoned = await AITrainingSession.cleanupAbandonedSessions(2);
      if (abandoned.length > 0) {
        console.log(`🧹 Cleaned up ${abandoned.length} abandoned sessions`);
      }
    } else {
      console.log('⚠️ Database Avatar Training Service: Using fallback storage');
    }
  } catch (error) {
    console.log('⚠️ Database initialization failed:', error.message);
    databaseAvailable = false;
  }
}

initializeDatabase();

export class DatabaseAvatarTrainingService {

  // Create new training session
  static async createSession(avatarId, customerId, scenario) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionData = {
      session_id: sessionId,
      avatar_id: avatarId,
      customer_id: customerId,
      scenario: scenario,
      status: 'running',
      performance_metrics: {
        response_quality: 90,
        customer_satisfaction: 88,
        goal_achievement: 85,
        conversation_flow: 92
      }
    };

    if (databaseAvailable) {
      try {
        const session = await AITrainingSession.create(sessionData);
        console.log(`✅ Database: Created training session ${sessionId}`);
        return session;
      } catch (error) {
        console.error('❌ Database session creation failed:', error.message);
        // Fall back to in-memory
        fallbackSessions.set(sessionId, {
          ...sessionData,
          messages: [],
          started_at: new Date(),
          duration: 0
        });
        return fallbackSessions.get(sessionId);
      }
    } else {
      // In-memory fallback
      fallbackSessions.set(sessionId, {
        ...sessionData,
        messages: [],
        started_at: new Date(),
        duration: 0
      });
      return fallbackSessions.get(sessionId);
    }
  }

  // Get session by ID
  static async getSession(sessionId) {
    if (databaseAvailable) {
      try {
        const session = await AITrainingSession.findBySessionId(sessionId);
        if (session) return session;
      } catch (error) {
        console.error('❌ Database session retrieval failed:', error.message);
      }
    }
    
    // Fallback to in-memory
    return fallbackSessions.get(sessionId);
  }

  // Continue conversation - generate AI responses
  static async continueConversation(sessionId) {
    let session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Training session ${sessionId} not found`);
    }

    try {
      // Generate patient question using Claude
      const patientQuestion = await ClaudeAvatarService.generatePatientQuestion(
        session.messages || [],
        session.scenario
      );

      // Create patient message
      const customerMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'customer',
        content: patientQuestion.question,
        timestamp: new Date().toISOString(),
        emotion: patientQuestion.emotion || 'neutral'
      };

      // Generate avatar response
      const avatarResponse = await this.generateResponse(
        customerMessage.content,
        session.avatar_id,
        session.messages || []
      );

      // Create avatar message
      const avatarMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'avatar',
        content: avatarResponse.content,
        timestamp: new Date().toISOString(),
        emotion: 'neutral',
        quality_score: avatarResponse.qualityScore || 90
      };

      // Update session with new messages
      const updatedMessages = [
        ...(session.messages || []),
        customerMessage,
        avatarMessage
      ];

      // Update performance metrics
      const updatedMetrics = {
        ...session.performance_metrics,
        response_quality: Math.max(70, (session.performance_metrics.response_quality + avatarResponse.qualityScore) / 2),
        customer_satisfaction: Math.max(60, session.performance_metrics.customer_satisfaction + Math.random() * 6 - 3),
        goal_achievement: Math.max(50, session.performance_metrics.goal_achievement + Math.random() * 10 - 5),
        conversation_flow: Math.max(70, session.performance_metrics.conversation_flow + Math.random() * 4 - 2)
      };

      // Save updated session
      if (databaseAvailable) {
        try {
          session = await AITrainingSession.update(sessionId, {
            messages: updatedMessages,
            performance_metrics: updatedMetrics
          });
        } catch (error) {
          console.error('❌ Database session update failed:', error.message);
          // Update fallback
          if (fallbackSessions.has(sessionId)) {
            fallbackSessions.get(sessionId).messages = updatedMessages;
            fallbackSessions.get(sessionId).performance_metrics = updatedMetrics;
            session = fallbackSessions.get(sessionId);
          }
        }
      } else {
        // Update fallback
        if (fallbackSessions.has(sessionId)) {
          fallbackSessions.get(sessionId).messages = updatedMessages;
          fallbackSessions.get(sessionId).performance_metrics = updatedMetrics;
          session = fallbackSessions.get(sessionId);
        }
      }

      console.log(`✅ AI Continue conversation completed for session ${sessionId}`);
      return session;

    } catch (error) {
      console.error('❌ Continue conversation failed:', error.message);
      throw error;
    }
  }

  // Generate avatar response
  static async generateResponse(customerMessage, avatarId, conversationHistory) {
    const startTime = Date.now();

    try {
      // Use ClaudeAvatarService for real AI response
      const response = await ClaudeAvatarService.generateAvatarResponse(
        customerMessage,
        avatarId,
        conversationHistory
      );

      const responseTime = Date.now() - startTime;
      
      return {
        content: response.content,
        qualityScore: response.quality_score || 85,
        responseTime
      };

    } catch (error) {
      console.error('AI response generation failed:', error);
      const responseTime = Date.now() - startTime;

      // Use intelligent fallback from ClaudeAvatarService
      const intelligentFallback = ClaudeAvatarService.generateIntelligentFallback(
        customerMessage, 
        { name: 'Dr. Sakura Wellness' }
      );
      
      return {
        content: intelligentFallback,
        qualityScore: 75,
        responseTime
      };
    }
  }

  // Stop training session
  static async stopSession(sessionId) {
    let session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Training session ${sessionId} not found`);
    }

    const duration = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);

    if (databaseAvailable) {
      try {
        session = await AITrainingSession.complete(sessionId, duration);
      } catch (error) {
        console.error('❌ Database session completion failed:', error.message);
        // Update fallback
        if (fallbackSessions.has(sessionId)) {
          fallbackSessions.get(sessionId).status = 'completed';
          fallbackSessions.get(sessionId).completed_at = new Date();
          fallbackSessions.get(sessionId).duration = duration;
          session = fallbackSessions.get(sessionId);
        }
      }
    } else {
      // Update fallback
      if (fallbackSessions.has(sessionId)) {
        fallbackSessions.get(sessionId).status = 'completed';
        fallbackSessions.get(sessionId).completed_at = new Date();
        fallbackSessions.get(sessionId).duration = duration;
        session = fallbackSessions.get(sessionId);
      }
    }

    console.log(`✅ Training session ${sessionId} completed`);
    return session;
  }

  // Get completed sessions for avatar
  static async getCompletedSessions(avatarId) {
    if (databaseAvailable) {
      try {
        return await AITrainingSession.getCompletedSessions(avatarId);
      } catch (error) {
        console.error('❌ Database query failed:', error.message);
      }
    }

    // Fallback: filter in-memory sessions
    const completed = [];
    for (const [sessionId, session] of fallbackSessions) {
      if (session.avatar_id === avatarId && session.status === 'completed') {
        completed.push(session);
      }
    }
    return completed;
  }

  // Get training statistics
  static async getTrainingStats() {
    if (databaseAvailable) {
      try {
        return await AITrainingSession.getStats();
      } catch (error) {
        console.error('❌ Database stats query failed:', error.message);
      }
    }

    // Fallback: calculate from in-memory sessions
    const totalSessions = fallbackSessions.size;
    let completedSessions = 0;
    let activeSessions = 0;

    for (const [, session] of fallbackSessions) {
      if (session.status === 'completed') completedSessions++;
      if (session.status === 'running') activeSessions++;
    }

    return {
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      active_sessions: activeSessions,
      average_duration: 0,
      unique_avatars: new Set(Array.from(fallbackSessions.values()).map(s => s.avatar_id)).size
    };
  }
}

export default DatabaseAvatarTrainingService;