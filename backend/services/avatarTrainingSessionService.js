// Original BrezCode Platform Avatar Training Session Service
// Comprehensive AI Training Platform - Database Implementation

import { ClaudeAvatarService } from './claudeAvatarService.js';
import { TRAINING_SCENARIOS } from '../avatarTrainingScenarios.js';
import AITrainingSession from '../models/AITrainingSession.js';
import { testConnection } from '../config/database.js';

// Fallback in-memory storage if database is unavailable
let fallbackSessions = new Map();
let fallbackMessages = new Map();
let sessionCounter = 1;
let databaseAvailable = false;

// Test database connection on service initialization
async function initializeDatabase() {
  try {
    databaseAvailable = await testConnection();
    if (databaseAvailable) {
      console.log('✅ AI Training Service: Database connection established');
      // Clean up any abandoned sessions from previous runs
      const abandoned = await AITrainingSession.cleanupAbandonedSessions(2);
      if (abandoned.length > 0) {
        console.log(`🧹 Cleaned up ${abandoned.length} abandoned training sessions`);
      }
    } else {
      console.log('⚠️ AI Training Service: Using in-memory fallback storage');
    }
  } catch (error) {
    console.log('⚠️ AI Training Service: Database initialization failed, using fallback:', error.message);
    databaseAvailable = false;
  }
}

// Initialize on service load
initializeDatabase();

export class AvatarTrainingSessionService {

  // Create new training session with complete scenario memory
  static async createSession(userId, avatarId, scenarioId, businessContext, scenarioDetails) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const sessionData = {
      id: sessionCounter++,
      sessionId,
      userId,
      avatarId,
      avatarType: avatarId.replace(/_.*/, ''), // Extract base avatar type
      scenarioId,
      scenarioName: scenarioDetails?.name || scenarioId,
      businessContext,
      status: 'active',
      totalMessages: 0,
      scenarioDetails: scenarioDetails, // Store complete scenario configuration
      conversationHistory: [], // Initialize empty conversation history
      currentContext: { 
        phase: 'introduction',
        topics_covered: [],
        customer_mood: scenarioDetails?.customerMood || 'neutral',
        objectives_remaining: scenarioDetails?.objectives || []
      },
      customerPersona: {
        name: scenarioDetails?.customerPersona || 'Anonymous Customer',
        mood: scenarioDetails?.customerMood || 'neutral',
        background: scenarioDetails?.description || '',
        concerns: scenarioDetails?.objectives || []
      },
      performanceMetrics: {
        average_quality: 0,
        response_count: 0,
        improvement_count: 0,
        knowledge_applied: 0
      },
      startedAt: new Date(),
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    sessions.set(sessionId, sessionData);

    // Add system message to initialize session
    await this.addSystemMessage(sessionId, `Training session started with ${avatarId} for scenario: ${scenarioDetails?.name || scenarioId}`);

    console.log(`🚀 Starting training session: ${JSON.stringify({ avatarId, scenarioId, businessContext })}`);
    return sessionData;
  }

  // Get session with full conversation history and context
  static async getSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    // Load all messages for this session
    const sessionMessages = Array.from(messages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    // Attach messages to session object
    session.messages = sessionMessages;
    session.conversationHistory = sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
      emotion: msg.emotion,
      timestamp: msg.createdAt,
      sequenceNumber: msg.sequenceNumber,
      messageId: msg.messageId
    }));

    return session;
  }

  // Add message to session with proper memory management
  static async addMessage(sessionId, role, content, emotion = 'neutral', aiResponseData = {}) {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get current session to update context
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Get current message count for sequence number
    const sessionMessages = Array.from(messages.values())
      .filter(msg => msg.sessionId === sessionId);
    const sequenceNumber = sessionMessages.length + 1;

    // Prepare message data
    const messageData = {
      id: Date.now() + Math.random(),
      sessionId,
      messageId,
      role,
      content,
      emotion,
      sequenceNumber,
      qualityScore: aiResponseData?.qualityScore,
      responseTime: aiResponseData?.responseTime,
      aiModel: aiResponseData?.aiModel,
      conversationContext: session.currentContext,
      topicsDiscussed: this.extractTopics(content),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    messages.set(messageId, messageData);

    // Update session with new message and context
    await this.updateSessionContext(sessionId, messageData);

    return messageData;
  }

  // Update session context and conversation history
  static async updateSessionContext(sessionId, newMessage) {
    const session = sessions.get(sessionId);
    if (!session) return;

    // Update conversation history
    const currentHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];
    const updatedHistory = [...currentHistory, {
      role: newMessage.role,
      content: newMessage.content,
      emotion: newMessage.emotion,
      timestamp: newMessage.createdAt,
      sequenceNumber: newMessage.sequenceNumber,
      messageId: newMessage.messageId
    }];

    // Update current context
    const currentContext = session.currentContext || {};
    const updatedContext = {
      ...currentContext,
      last_message_role: newMessage.role,
      last_message_time: newMessage.createdAt,
      topics_covered: [
        ...(currentContext.topics_covered || []),
        ...(Array.isArray(newMessage.topicsDiscussed) ? newMessage.topicsDiscussed : [])
      ].filter((topic, index, arr) => arr.indexOf(topic) === index), // Remove duplicates
      message_count: newMessage.sequenceNumber
    };

    // Update session in memory
    session.conversationHistory = updatedHistory;
    session.currentContext = updatedContext;
    session.totalMessages = newMessage.sequenceNumber;
    session.lastActiveAt = new Date();
    session.updatedAt = new Date();

    sessions.set(sessionId, session);
  }

  // Generate AI response with full session memory using Claude
  static async generateResponse(sessionId, customerMessage, emotion = 'neutral') {
    const startTime = Date.now();

    // Get session with full context
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Build conversation history for AI context
    const conversationHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];

    console.log(`🔄 Generating AI response for ${session.avatarType} - Customer question: "${customerMessage}"`);
    console.log(`🎯 Session context: ${session.businessContext}, Avatar: ${session.avatarType}`);

    try {
      // Fetch scenario data for context
      const scenarioData = await this.getScenarioById(session.scenarioId);
      
      // Get all training memory for this avatar
      const allTrainingMemory = await this.getAllTrainingMemoryForAvatar(session.avatarId, session.userId);

      // Use Claude with full session context, customer message, scenario context, training memory
      const response = await ClaudeAvatarService.generateAvatarResponse(
        session.avatarType,
        customerMessage,
        conversationHistory,
        session.businessContext,
        scenarioData,
        allTrainingMemory, // Pass complete training history
        session.avatarId // Pass avatar ID for knowledge base search
      );

      const responseTime = Date.now() - startTime;
      console.log(`🎯 Claude generated response for question: "${customerMessage.substring(0, 100)}..."`);

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

  // Continue conversation with AI-generated patient question and avatar response
  static async continueConversation(sessionId) {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const scenario = await this.getScenarioById(session.scenarioId);
    
    // Get conversation history from memory
    const conversationHistory = Array.from(messages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    // Generate AI patient question using Claude
    const patientQuestion = await ClaudeAvatarService.generatePatientQuestion(
      conversationHistory,
      scenario,
      session.avatarId
    );

    // Add the AI-generated patient question 
    const customerMessage = await this.addMessage(
      sessionId,
      'customer',
      patientQuestion.question,
      patientQuestion.emotion
    );

    // Generate avatar's response to the patient question
    const aiResponse = await this.generateResponse(sessionId, patientQuestion.question);

    // Save avatar's response
    const avatarMessage = await this.addMessage(
      sessionId,
      'avatar',
      aiResponse.content,
      'neutral',
      {
        qualityScore: aiResponse.qualityScore,
        responseTime: aiResponse.responseTime,
        aiModel: 'claude-sonnet-4'
      }
    );

    console.log(`✅ AI Continue conversation completed for session ${sessionId}`);

    // Return updated session
    const updatedSession = await this.getSession(sessionId);
    if (!updatedSession) throw new Error('Failed to retrieve updated session');
    return updatedSession;
  }

  // Add system message (for session initialization, etc.)
  static async addSystemMessage(sessionId, content) {
    return this.addMessage(sessionId, 'system', content);
  }

  // Complete training session with summary
  static async completeSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return;

    // Generate session summary
    const sessionSummary = await this.generateSessionSummary(session);

    // Calculate session duration
    const sessionDuration = Math.round((Date.now() - new Date(session.startedAt).getTime()) / (1000 * 60));

    // Update session as completed
    session.status = 'completed';
    session.completedAt = new Date();
    session.sessionDuration = sessionDuration;
    session.sessionSummary = sessionSummary.summary;
    session.keyAchievements = sessionSummary.achievements;
    session.areasForImprovement = sessionSummary.improvements;
    session.nextRecommendations = sessionSummary.recommendations;
    session.updatedAt = new Date();

    sessions.set(sessionId, session);

    console.log(`✅ Session completed successfully: ${sessionId}`);
  }

  // Generate session summary
  static async generateSessionSummary(session) {
    const conversationHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];
    const messageCount = conversationHistory.length;

    return {
      summary: `Training session with ${session.avatarId} focused on ${session.scenarioName}. ${messageCount} messages exchanged with focus on practical application and skill development.`,
      achievements: [
        "Completed scenario-based training",
        "Practiced real-world patient interactions",
        "Applied health coaching knowledge in context",
        "Demonstrated empathetic communication"
      ],
      improvements: [
        "Continue practicing similar scenarios",
        "Focus on response quality and medical accuracy",
        "Build knowledge base further",
        "Practice handling complex emotional situations"
      ],
      recommendations: [
        "Try more challenging scenarios with high-risk patients",
        "Practice different patient demographics",
        "Review session learnings and apply feedback",
        "Focus on prevention counseling techniques"
      ]
    };
  }

  // Get all sessions for a user
  static async getUserSessions(userId) {
    return Array.from(sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get total sessions count
  static async getTotalSessionsCount() {
    return sessions.size;
  }

  // Get scenario by ID from static training scenarios
  static async getScenarioById(scenarioId) {
    return TRAINING_SCENARIOS.find(scenario => scenario.id === scenarioId) || null;
  }

  // Extract topics from message content
  static extractTopics(content) {
    const topics = [];
    const topicKeywords = [
      'breast health', 'self-exam', 'mammogram', 'screening', 'lumps',
      'anxiety', 'health concerns', 'prevention', 'early detection',
      'medical advice', 'health coaching', 'wellness', 'symptoms',
      'family history', 'genetic testing', 'lifestyle', 'diet', 'exercise'
    ];

    const lowerContent = content.toLowerCase();
    topicKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  }

  // Get all training memory for a specific avatar and user (for memory integration)
  static async getAllTrainingMemoryForAvatar(avatarId, userId) {
    try {
      const userSessions = await this.getUserSessions(userId);
      const completedSessions = userSessions.filter(s => 
        s.avatarId === avatarId && s.status === 'completed'
      );

      console.log(`🧠 Retrieved ${completedSessions.length} completed training sessions for avatar ${avatarId}`);
      return completedSessions;
    } catch (error) {
      console.error('Error retrieving training memory:', error);
      return [];
    }
  }

  // Get all training sessions (for admin/debugging)
  static async getAllSessions() {
    return Array.from(sessions.values());
  }

  // Get all messages for a session
  static async getSessionMessages(sessionId) {
    return Array.from(messages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }

  // Clear all data (for testing)
  static async clearAllData() {
    sessions.clear();
    messages.clear();
    sessionCounter = 1;
    console.log('🧹 All training data cleared');
  }
}

