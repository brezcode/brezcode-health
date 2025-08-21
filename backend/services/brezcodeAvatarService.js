import Anthropic from '@anthropic-ai/sdk';

/*
The newest Anthropic model is "claude-sonnet-4-20250514", not older models. 
Always prefer using "claude-sonnet-4-20250514" as it is the latest model.
*/

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Dr. Sakura Wellness Avatar Configuration for BrezCode Health
const DR_SAKURA_CONFIG = {
  id: 'dr_sakura_brezcode',
  name: 'Dr. Sakura Wellness',
  role: 'Breast Health Coach',
  personality: {
    empathetic: true,
    professional: true,
    encouraging: true,
    culturallyAware: true
  },
  expertise: [
    'Breast health education',
    'Risk assessment interpretation',
    'Preventive care guidance',
    'Lifestyle recommendations',
    'Emotional support for health anxiety'
  ],
  appearance: {
    hairColor: 'Soft pink with gentle waves',
    eyeColor: 'Warm brown eyes',
    style: 'Professional medical attire with cherry blossom pin',
    demeanor: 'Calm, reassuring, and approachable'
  },
  communicationStyle: 'Warm, evidence-based, culturally sensitive',
  specializations: [
    'Breast self-examination guidance',
    'Understanding mammogram results',
    'Family history risk factors',
    'Lifestyle modifications for breast health',
    'Mental wellness during health concerns'
  ]
};

// In-memory storage for user sessions (replace with database later)
let userSessions = {};

export class BrezcodeAvatarService {
  
  // Get Dr. Sakura avatar configuration
  static getDrSakuraConfig() {
    return DR_SAKURA_CONFIG;
  }

  // Generate Dr. Sakura response with user context
  static async generateDrSakuraResponse(
    userId,
    userMessage,
    conversationHistory = [],
    context = {}
  ) {
    try {
      console.log(`🌸 Dr. Sakura generating response for user ${userId}...`);
      
      // Get user health data for personalized responses
      const userHealthData = await this.getUserHealthData(userId);
      
      // Build personalized system prompt
      const systemPrompt = this.buildDrSakuraSystemPrompt(userHealthData, context);
      
      // Build conversation context
      const conversationContext = conversationHistory.length > 0 
        ? `\n\nConversation History:\n${conversationHistory.map((msg, i) => 
            `${msg.role === 'user' ? 'Patient' : 'Dr. Sakura'}: ${msg.content}`
          ).join('\n')}`
        : '';

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Patient says: "${userMessage}"${conversationContext}
          
Please respond as Dr. Sakura with empathy, medical accuracy, and cultural sensitivity. 
Provide specific, actionable guidance while being supportive and reassuring.`
        }]
      });

      const content = response.content[0]?.text || 'I understand your concern and I\'m here to help you with your breast health questions.';
      
      // Calculate response quality scores
      const empathyScore = this.calculateEmpathyScore(content);
      const medicalAccuracy = this.calculateMedicalAccuracy(content, userMessage);

      // Store conversation in session history
      this.storeConversation(userId, userMessage, content);

      console.log(`✅ Dr. Sakura response generated (empathy: ${empathyScore}, accuracy: ${medicalAccuracy})`);

      return {
        content,
        empathyScore,
        medicalAccuracy,
        avatarId: DR_SAKURA_CONFIG.id,
        avatarName: DR_SAKURA_CONFIG.name,
        role: DR_SAKURA_CONFIG.role,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating Dr. Sakura response:', error);
      
      // Fallback response with high empathy
      return {
        content: `I understand you're reaching out about your breast health, and I want you to know that taking this step shows great self-care. While I'm having a technical moment, I want to assure you that your concerns are valid and important. Please consider discussing this with your healthcare provider, and remember that being proactive about your health is always the right choice. I'm here to support you on this journey.`,
        empathyScore: 95,
        medicalAccuracy: 85,
        avatarId: DR_SAKURA_CONFIG.id,
        avatarName: DR_SAKURA_CONFIG.name,
        role: DR_SAKURA_CONFIG.role,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get user health data for personalized responses
  static async getUserHealthData(userId) {
    try {
      console.log(`🔍 Fetching health data for user ${userId}...`);
      
      // In current implementation, get from memory storage
      // This will be replaced with database queries later
      const userData = userSessions[userId] || null;
      
      if (!userData) {
        console.log(`❌ User ${userId} not found in session storage`);
        return null;
      }

      console.log(`✅ Found user session data for ${userId}`);
      return userData;
      
    } catch (error) {
      console.error(`⚠️ Error fetching health data for user ${userId}:`, error);
      return null;
    }
  }

  // Store user session data
  static storeUserSession(userId, userData) {
    userSessions[userId] = {
      ...userData,
      lastActivity: new Date(),
      conversations: userSessions[userId]?.conversations || []
    };
    console.log(`💾 Stored session data for user ${userId}`);
  }

  // Store conversation in user session
  static storeConversation(userId, userMessage, avatarResponse) {
    if (!userSessions[userId]) {
      userSessions[userId] = { conversations: [] };
    }
    
    userSessions[userId].conversations.push({
      timestamp: new Date(),
      userMessage,
      avatarResponse,
      empathyScore: this.calculateEmpathyScore(avatarResponse),
      medicalAccuracy: this.calculateMedicalAccuracy(avatarResponse, userMessage)
    });

    // Keep only last 50 conversations per user
    if (userSessions[userId].conversations.length > 50) {
      userSessions[userId].conversations = userSessions[userId].conversations.slice(-50);
    }

    console.log(`💬 Stored conversation for user ${userId} (total: ${userSessions[userId].conversations.length})`);
  }

  // Get user conversation history
  static getUserConversations(userId, limit = 10) {
    const session = userSessions[userId];
    if (!session || !session.conversations) {
      return [];
    }
    
    return session.conversations.slice(-limit);
  }

  // Build Dr. Sakura's personalized system prompt
  static buildDrSakuraSystemPrompt(userHealthData, context) {
    let personalizedInfo = '';
    
    if (userHealthData) {
      personalizedInfo = `
👤 PATIENT PROFILE:
• Name: ${userHealthData.firstName || ''} ${userHealthData.lastName || ''}
• Age: ${userHealthData.age || 'Not specified'}
• Email: ${userHealthData.email || 'not provided'}`;

      if (userHealthData.quizAnswers) {
        personalizedInfo += `
• Health Assessment: Completed
• Risk factors: Based on assessment data
• Personalized guidance available`;
      } else {
        personalizedInfo += `
• Health Assessment: Not completed yet
• Encourage completing assessment for personalized guidance`;
      }
    } else {
      personalizedInfo = `
❌ PATIENT PROFILE: Unknown user
🚨 No health data available. Encourage user to complete registration and assessment.`;
    }

    const basePrompt = `You are Dr. Sakura Wellness, a compassionate and culturally-aware breast health coach and wellness expert. You specialize in:

🌸 PERSONALITY:
- Warm, empathetic, and professionally caring
- Culturally sensitive and inclusive in your approach  
- Evidence-based medical knowledge with emotional intelligence
- Encouraging and supportive, especially for health anxiety
- Professional yet approachable communication style

🏥 EXPERTISE:
- Breast health education and risk assessment
- Preventive care and lifestyle recommendations
- Self-examination techniques and guidance
- Mammogram and screening interpretation
- Family history and genetic risk factors
- Nutrition and exercise for breast health
- Emotional support during health concerns

🎯 COMMUNICATION GUIDELINES:
- Always acknowledge the emotional aspect of health concerns
- Provide specific, actionable advice when appropriate
- Use "I understand" and "Let me help you" language
- Include relevant medical disclaimers when needed
- Encourage professional medical consultation for serious concerns
- Be culturally sensitive and inclusive
- Use gentle, non-alarming language while being informative

🚨 IMPORTANT BOUNDARIES:
- Never diagnose medical conditions
- Always recommend professional medical consultation for concerning symptoms
- Provide educational information, not medical advice
- Support emotional wellbeing alongside health education

${personalizedInfo}`;

    if (context.currentConcerns?.length > 0) {
      basePrompt += `\n\n📋 CURRENT CONCERNS:\n${context.currentConcerns.join(', ')}\n`;
    }

    return basePrompt;
  }

  // Calculate empathy score based on response content
  static calculateEmpathyScore(content) {
    const empathyMarkers = [
      'understand', 'feel', 'support', 'here for you', 'normal to', 
      'many women', 'you\'re not alone', 'take care of yourself',
      'important to', 'proud of you', 'brave', 'concern'
    ];
    
    const found = empathyMarkers.filter(marker => 
      content.toLowerCase().includes(marker)
    ).length;
    
    return Math.min(95, 60 + (found * 8));
  }

  // Calculate medical accuracy score
  static calculateMedicalAccuracy(content, userMessage) {
    const medicalTerms = [
      'healthcare provider', 'screening', 'examination', 'symptoms',
      'risk factors', 'evidence', 'professional', 'medical',
      'mammogram', 'self-exam', 'lifestyle', 'prevention'
    ];
    
    const found = medicalTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).length;
    
    // Higher score for medical terminology and professional language
    return Math.min(95, 70 + (found * 5));
  }

  // Get Dr. Sakura training scenarios for health coaching
  static getTrainingScenarios() {
    return [
      {
        id: 'breast_health_anxiety',
        name: 'Patient with Breast Health Anxiety',
        description: 'Patient expressing worry about breast changes or family history',
        difficulty: 'intermediate',
        patientPersona: {
          name: 'Sarah',
          age: 35,
          concerns: ['Found a lump during self-exam', 'Family history of breast cancer'],
          mood: 'anxious',
          background: 'First time experiencing breast health concerns'
        },
        objectives: [
          'Provide reassurance and emotional support',
          'Guide toward appropriate medical consultation',
          'Educate about normal breast changes',
          'Encourage continued self-care practices'
        ]
      },
      {
        id: 'screening_guidance',
        name: 'Mammogram Results Discussion',
        description: 'Patient needs help understanding screening results',
        difficulty: 'advanced',
        patientPersona: {
          name: 'Maria',
          age: 42,
          concerns: ['Confusing mammogram report', 'Dense breast tissue mentioned'],
          mood: 'confused',
          background: 'Regular screening participant'
        },
        objectives: [
          'Explain screening results in understandable terms',
          'Discuss next steps and follow-up care',
          'Address concerns about dense breast tissue',
          'Reinforce importance of regular screening'
        ]
      },
      {
        id: 'lifestyle_consultation',
        name: 'Preventive Lifestyle Guidance',
        description: 'Patient seeking proactive breast health advice',
        difficulty: 'beginner',
        patientPersona: {
          name: 'Jennifer',
          age: 28,
          concerns: ['Wants to be proactive about breast health', 'Diet and exercise questions'],
          mood: 'motivated',
          background: 'Health-conscious individual seeking prevention strategies'
        },
        objectives: [
          'Provide evidence-based lifestyle recommendations',
          'Teach proper self-examination techniques',
          'Discuss nutrition and exercise benefits',
          'Create personalized prevention plan'
        ]
      }
    ];
  }

  // Get session statistics
  static getSessionStats() {
    const totalSessions = Object.keys(userSessions).length;
    const totalConversations = Object.values(userSessions).reduce(
      (sum, session) => sum + (session.conversations?.length || 0), 0
    );
    
    return {
      totalSessions,
      totalConversations,
      averageConversationsPerSession: totalSessions > 0 ? (totalConversations / totalSessions).toFixed(2) : 0,
      activeSessions: Object.values(userSessions).filter(
        session => session.lastActivity && 
        (Date.now() - new Date(session.lastActivity).getTime()) < 24 * 60 * 60 * 1000
      ).length
    };
  }
}