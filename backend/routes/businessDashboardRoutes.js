import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { BrezcodeAvatarService } from '../services/brezcodeAvatarService.js';

const router = express.Router();

// Apply authentication to all dashboard routes
router.use(requireAuth);

// Get dashboard analytics and metrics
router.get('/analytics', async (req, res) => {
  try {
    console.log(`📊 Dashboard analytics requested by admin: ${req.session.email}`);
    
    // Get avatar system stats
    const avatarStats = BrezcodeAvatarService.getSessionStats();
    
    // Mock analytics data (replace with real database queries)
    const analytics = {
      overview: {
        totalUsers: 1247,
        activeUsers: 234,
        newUsersThisWeek: 89,
        completedAssessments: 1156,
        averageRiskScore: 32.5,
        userRetentionRate: 78.2
      },
      userGrowth: {
        thisWeek: 12.5,
        thisMonth: 24.3,
        thisQuarter: 67.8
      },
      healthMetrics: {
        avgCompletionTime: 8.5, // minutes
        riskDistribution: {
          low: 45,
          moderate: 38,
          high: 17
        },
        popularFeatures: [
          { name: 'Risk Assessment', usage: 98.2 },
          { name: 'Dr. Sakura Chat', usage: 76.4 },
          { name: 'Health Reports', usage: 89.1 },
          { name: 'Lifestyle Tips', usage: 64.7 }
        ]
      },
      aiPerformance: {
        ...avatarStats,
        avgEmpathyScore: 87.3,
        avgMedicalAccuracy: 94.1,
        avgResponseTime: 1.2, // seconds
        userSatisfactionRating: 4.7
      },
      recentActivity: [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'user_registration',
          message: 'New user completed health assessment',
          details: { riskScore: 28, location: 'Hong Kong' }
        },
        {
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: 'ai_training',
          message: 'Dr. Sakura training session completed',
          details: { scenario: 'Anxiety Support', score: 9.2 }
        },
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          type: 'system_update',
          message: 'WhatsApp integration deployed successfully',
          details: { version: 'v2.1.0' }
        }
      ]
    };
    
    res.json({
      success: true,
      analytics,
      generatedAt: new Date(),
      requestedBy: req.session.email
    });
    
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to get dashboard analytics' 
    });
  }
});

// Get user management data
router.get('/users', async (req, res) => {
  try {
    console.log(`👥 User management data requested by admin: ${req.session.email}`);
    
    const { page = 1, limit = 50, search = '', filter = 'all' } = req.query;
    
    // Mock user data (replace with real database queries)
    const users = [
      {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@example.com',
        createdAt: new Date('2024-08-15'),
        lastActive: new Date('2024-08-21'),
        assessmentCompleted: true,
        riskScore: 25,
        riskCategory: 'Low Risk',
        platform: 'web'
      },
      {
        id: 2,
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@example.com',
        createdAt: new Date('2024-08-18'),
        lastActive: new Date('2024-08-20'),
        assessmentCompleted: true,
        riskScore: 42,
        riskCategory: 'Moderate Risk',
        platform: 'mobile'
      },
      {
        id: 3,
        firstName: 'Jennifer',
        lastName: 'Kim',
        email: 'jennifer.kim@example.com',
        createdAt: new Date('2024-08-20'),
        lastActive: new Date('2024-08-21'),
        assessmentCompleted: false,
        riskScore: null,
        riskCategory: null,
        platform: 'web'
      }
    ];
    
    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.length / parseInt(limit)),
        totalUsers: users.length,
        usersPerPage: parseInt(limit)
      },
      filters: {
        search,
        filter,
        appliedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('User management error:', error);
    res.status(500).json({ 
      error: 'Failed to get user data' 
    });
  }
});

// Get AI training data and scenarios
router.get('/ai-training', async (req, res) => {
  try {
    console.log(`🤖 AI training data requested by admin: ${req.session.email}`);
    
    // Get Dr. Sakura training scenarios
    const scenarios = BrezcodeAvatarService.getTrainingScenarios();
    
    // Get avatar configuration
    const drSakuraConfig = BrezcodeAvatarService.getDrSakuraConfig();
    
    const trainingData = {
      avatar: drSakuraConfig,
      scenarios,
      performance: {
        totalSessions: 156,
        avgEmpathyScore: 87.3,
        avgMedicalAccuracy: 94.1,
        improvementRate: 12.5,
        lastTrainingSession: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      trainingProgress: [
        { scenario: 'Breast Health Anxiety', sessions: 45, avgScore: 8.7, difficulty: 'intermediate' },
        { scenario: 'Mammogram Results', sessions: 32, avgScore: 9.1, difficulty: 'advanced' },
        { scenario: 'Lifestyle Consultation', sessions: 67, avgScore: 8.9, difficulty: 'beginner' },
        { scenario: 'Family History Concerns', sessions: 28, avgScore: 8.4, difficulty: 'intermediate' }
      ]
    };
    
    res.json({
      success: true,
      trainingData,
      generatedAt: new Date()
    });
    
  } catch (error) {
    console.error('AI training data error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI training data' 
    });
  }
});

// Get system health and status
router.get('/system-health', async (req, res) => {
  try {
    console.log(`🏥 System health requested by admin: ${req.session.email}`);
    
    const systemHealth = {
      server: {
        status: 'healthy',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      },
      database: {
        status: 'healthy',
        connections: 5,
        responseTime: 12 // ms
      },
      ai: {
        status: 'healthy',
        anthropicConnected: !!process.env.ANTHROPIC_API_KEY,
        avgResponseTime: 1.2, // seconds
        successRate: 99.7
      },
      whatsapp: {
        status: 'healthy',
        webhookConnected: true,
        messagesProcessed: 234,
        successRate: 98.9
      },
      email: {
        status: 'healthy',
        sendgridConnected: !!process.env.SENDGRID_API_KEY,
        emailsSent: 456,
        deliveryRate: 99.2
      }
    };
    
    res.json({
      success: true,
      systemHealth,
      checkedAt: new Date()
    });
    
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ 
      error: 'Failed to get system health' 
    });
  }
});

// Get real-time activity feed
router.get('/activity-feed', async (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'user_action',
        title: 'New Health Assessment',
        description: 'User completed breast health risk assessment',
        data: { userId: 123, riskScore: 28, category: 'Low Risk' }
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        type: 'ai_interaction',
        title: 'Dr. Sakura Consultation',
        description: 'User had 15-minute health coaching session',
        data: { empathyScore: 92, accuracyScore: 96 }
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        type: 'whatsapp',
        title: 'WhatsApp Verification',
        description: 'User verified account via WhatsApp',
        data: { phoneNumber: '+852****1234', success: true }
      }
    ];
    
    res.json({
      success: true,
      activities,
      total: activities.length,
      fetchedAt: new Date()
    });
    
  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({ 
      error: 'Failed to get activity feed' 
    });
  }
});

export default router;