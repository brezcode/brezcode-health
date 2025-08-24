// Original BrezCode Platform Avatar Training Routes
import express from 'express';
import { AvatarTrainingSessionService } from '../services/avatarTrainingSessionService.js';
import { TRAINING_SCENARIOS, AVATAR_TYPES } from '../avatarTrainingScenarios.js';

const router = express.Router();

// Simple auth middleware (replace with proper auth in production)
const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    req.session.userId = 1; // Demo user
  }
  next();
};

// Get all training scenarios
router.get('/scenarios', async (req, res) => {
  try {
    const { avatarType } = req.query;

    let scenarios = TRAINING_SCENARIOS;
    
    // Filter by avatar type if specified
    if (avatarType) {
      scenarios = scenarios.filter(scenario => scenario.avatarType === avatarType);
    }

    // Transform to match frontend expectations
    const formattedScenarios = scenarios.map(scenario => ({
      id: scenario.id,
      title: scenario.name,
      description: scenario.description,
      difficulty: scenario.difficulty,
      healthFocus: scenario.industry,
      estimatedDuration: scenario.timeframeMins,
      objectives: scenario.objectives,
      avatarType: scenario.avatarType,
      customerPersona: scenario.customerPersona,
      customerMood: scenario.customerMood
    }));

    res.json({
      success: true,
      scenarios: formattedScenarios,
      total: formattedScenarios.length
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch training scenarios' });
  }
});

// Start a new training session
router.post('/sessions/start', requireAuth, async (req, res) => {
  try {
    const { scenarioId, avatarId = 'dr_sakura' } = req.body;
    const userId = req.session.userId;
    
    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID is required' });
    }
    
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    // Create new training session using the comprehensive service
    const session = await AvatarTrainingSessionService.createSession(
      userId,
      avatarId,
      scenarioId,
      'health_coaching',
      scenario
    );
    
    console.log(`✅ Training session started: ${session.sessionId} for scenario: ${scenario.name}`);
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      message: 'Training session started successfully',
      session: {
        id: session.sessionId,
        scenarioId: session.scenarioId,
        avatarId: session.avatarId,
        status: session.status,
        startedAt: session.startedAt,
        scenario: {
          id: scenario.id,
          title: scenario.name,
          description: scenario.description,
          difficulty: scenario.difficulty
        }
      }
    });
    
  } catch (error) {
    console.error('Error starting training session:', error);
    res.status(500).json({ error: 'Failed to start training session' });
  }
});

// Continue conversation in training session
router.post('/sessions/:sessionId/continue', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { customerMessage } = req.body;

    console.log('🔍 API Continue Request:');
    console.log('   Session ID:', sessionId);
    console.log('   Customer message:', customerMessage);

    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        sessionId: sessionId
      });
    }

    // Use the original service's continue conversation method
    const updatedSession = await AvatarTrainingSessionService.continueConversation(sessionId);

    res.json({
      success: true,
      session: {
        id: updatedSession.sessionId,
        sessionId: updatedSession.sessionId,
        avatarId: updatedSession.avatarId,
        avatarType: updatedSession.avatarType,
        scenarioId: updatedSession.scenarioId,
        status: updatedSession.status,
        messages: updatedSession.conversationHistory || [],
        totalMessages: updatedSession.totalMessages
      }
    });
  } catch (error) {
    console.error('❌ Continue conversation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to continue conversation',
      details: error.message
    });
  }
});

// Send message to training session
router.post('/sessions/:sessionId/message', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session is not active' });
    }
    
    // Add user message
    await AvatarTrainingSessionService.addMessage(
      sessionId,
      'customer',
      message,
      'neutral'
    );
    
    // Generate AI response
    const aiResponse = await AvatarTrainingSessionService.generateResponse(
      sessionId,
      message
    );
    
    // Add AI message
    await AvatarTrainingSessionService.addMessage(
      sessionId,
      'avatar',
      aiResponse.content,
      'professional',
      {
        qualityScore: aiResponse.qualityScore,
        responseTime: aiResponse.responseTime,
        aiModel: 'claude-sonnet-4'
      }
    );
    
    const updatedSession = await AvatarTrainingSessionService.getSession(sessionId);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      response: {
        content: aiResponse.content,
        qualityScore: aiResponse.qualityScore
      },
      session: {
        id: updatedSession.sessionId,
        messages: updatedSession.conversationHistory || [],
        totalMessages: updatedSession.totalMessages
      }
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get session details
router.get('/sessions/:sessionId', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      success: true,
      session: {
        id: session.sessionId,
        avatarId: session.avatarId,
        scenarioId: session.scenarioId,
        status: session.status,
        startedAt: session.startedAt,
        messages: session.conversationHistory || [],
        totalMessages: session.totalMessages
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Get user sessions
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const sessions = await AvatarTrainingSessionService.getUserSessions(userId);
    
    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session.sessionId,
        scenarioId: session.scenarioId,
        avatarId: session.avatarId,
        status: session.status,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        totalMessages: session.totalMessages
      })),
      total: sessions.length
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;