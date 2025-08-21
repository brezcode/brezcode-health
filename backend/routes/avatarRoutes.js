import express from 'express';
import { BrezcodeAvatarService } from '../services/brezcodeAvatarService.js';

const router = express.Router();

// Dr. Sakura avatar configuration endpoint
router.get('/dr-sakura/config', (req, res) => {
  try {
    const config = BrezcodeAvatarService.getDrSakuraConfig();
    res.json({
      success: true,
      avatar: config
    });
  } catch (error) {
    console.error('Error getting Dr. Sakura config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get avatar configuration'
    });
  }
});

// Chat with Dr. Sakura endpoint
router.post('/dr-sakura/chat', async (req, res) => {
  try {
    const { userId, message, conversationHistory = [], context = {} } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'User ID and message are required'
      });
    }

    console.log(`🌸 Dr. Sakura chat request from user ${userId}: "${message.substring(0, 50)}..."`);

    const response = await BrezcodeAvatarService.generateDrSakuraResponse(
      userId,
      message,
      conversationHistory,
      context
    );

    res.json({
      success: true,
      response: {
        content: response.content,
        avatarId: response.avatarId,
        avatarName: response.avatarName,
        role: response.role,
        qualityScores: {
          empathy: response.empathyScore,
          medicalAccuracy: response.medicalAccuracy,
          overall: Math.round((response.empathyScore + response.medicalAccuracy) / 2)
        },
        timestamp: response.timestamp
      }
    });

  } catch (error) {
    console.error('Error in Dr. Sakura chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate avatar response',
      fallbackResponse: {
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please know that your health concerns are important, and I encourage you to reach out to a healthcare professional if you need immediate assistance. I'm here to support you once I'm back online.",
        avatarId: 'dr_sakura_brezcode',
        avatarName: 'Dr. Sakura Wellness',
        role: 'Breast Health Coach',
        empathy: 90,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Set user session data for personalized responses
router.post('/user/:userId/session', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    BrezcodeAvatarService.storeUserSession(userId, userData);

    res.json({
      success: true,
      message: 'User session data stored successfully'
    });

  } catch (error) {
    console.error('Error storing user session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store user session data'
    });
  }
});

// Get user conversation history
router.get('/user/:userId/conversations', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const conversations = BrezcodeAvatarService.getUserConversations(userId, parseInt(limit));

    res.json({
      success: true,
      conversations,
      total: conversations.length
    });

  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation history'
    });
  }
});

// Get Dr. Sakura training scenarios
router.get('/dr-sakura/training-scenarios', (req, res) => {
  try {
    const scenarios = BrezcodeAvatarService.getTrainingScenarios();
    
    res.json({
      success: true,
      scenarios,
      total: scenarios.length
    });
  } catch (error) {
    console.error('Error getting training scenarios:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get training scenarios'
    });
  }
});

// Avatar system statistics
router.get('/stats', (req, res) => {
  try {
    const stats = BrezcodeAvatarService.getSessionStats();
    
    res.json({
      success: true,
      stats: {
        ...stats,
        avatarSystem: 'Dr. Sakura Wellness v1.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting avatar stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system statistics'
    });
  }
});

// Health check for avatar system
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    avatar: 'Dr. Sakura Wellness',
    anthropicConnected: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
});

export default router;