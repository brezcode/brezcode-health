// Avatar Training Sessions Schema - Complete session management with memory
// Converted from TypeScript to JavaScript for brezcode-health integration

export const avatarTrainingSessionSchema = {
  table: "avatar_training_sessions",
  fields: {
    id: { type: "serial", primaryKey: true },
    sessionId: { type: "text", notNull: true, unique: true }, // Unique session identifier
    userId: { type: "integer", notNull: true }, // References users.id
    
    // Session Configuration
    avatarId: { type: "text", notNull: true }, // Which avatar is being trained
    avatarType: { type: "text", notNull: true }, // Avatar personality type
    scenarioId: { type: "text", notNull: true }, // Training scenario
    scenarioName: { type: "text", notNull: true }, // Human-readable scenario name
    businessContext: { type: "text", notNull: true }, // Business vertical
    
    // Session State
    status: { type: "text", default: 'active' }, // active, completed, paused, archived
    totalMessages: { type: "integer", default: 0 },
    sessionDuration: { type: "integer" }, // Total duration in minutes
    
    // Session Memory & Context
    scenarioDetails: { type: "jsonb" }, // Complete scenario configuration
    conversationHistory: { type: "jsonb" }, // All messages in order
    currentContext: { type: "jsonb" }, // Current conversation state
    customerPersona: { type: "jsonb" }, // Customer profile being simulated
    
    // Learning & Performance
    learningPoints: { type: "jsonb" }, // Key insights from this session
    performanceMetrics: { type: "jsonb" }, // Quality scores, improvements
    knowledgeApplied: { type: "jsonb" }, // Knowledge used in this session
    skillsImproved: { type: "jsonb" }, // Skills that were practiced
    
    // Session Summary
    sessionSummary: { type: "text" }, // AI-generated summary
    keyAchievements: { type: "jsonb" }, // What was accomplished
    areasForImprovement: { type: "jsonb" }, // What needs work
    nextRecommendations: { type: "jsonb" }, // Suggested follow-up
    
    // Metadata
    startedAt: { type: "timestamp", defaultNow: true },
    completedAt: { type: "timestamp" },
    lastActiveAt: { type: "timestamp", defaultNow: true },
    createdAt: { type: "timestamp", defaultNow: true },
    updatedAt: { type: "timestamp", defaultNow: true },
  }
};

// Session Messages Schema - Individual messages within training sessions
export const avatarTrainingMessageSchema = {
  table: "avatar_training_messages",
  fields: {
    id: { type: "serial", primaryKey: true },
    sessionId: { type: "text", notNull: true, references: "avatar_training_sessions.sessionId" },
    messageId: { type: "text", notNull: true, unique: true }, // Unique message identifier
    
    // Message Content
    role: { type: "text", notNull: true }, // 'customer', 'avatar', 'system', 'patient'
    content: { type: "text", notNull: true }, // Full message content
    emotion: { type: "text" }, // Message emotion (anxious, confident, neutral, etc.)
    sequenceNumber: { type: "integer", notNull: true }, // Order in conversation
    
    // AI Response Data (for avatar messages)
    qualityScore: { type: "integer" }, // AI response quality (0-100)
    responseTime: { type: "integer" }, // Time to generate response (ms)
    aiModel: { type: "text" }, // Which AI model was used (claude, openai)
    
    // Learning & Feedback
    userFeedback: { type: "text" }, // User comment on the response
    improvedResponse: { type: "text" }, // Improved response if feedback given
    improvementScore: { type: "integer" }, // Quality of improvement
    
    // Context & Memory
    conversationContext: { type: "jsonb" }, // Context at time of message
    knowledgeUsed: { type: "jsonb" }, // Knowledge applied in this message
    topicsDiscussed: { type: "jsonb" }, // Topics covered
    
    // Metadata
    createdAt: { type: "timestamp", defaultNow: true },
    updatedAt: { type: "timestamp", defaultNow: true },
  }
};

// Training Scenarios - Static scenarios configuration
export const TRAINING_SCENARIOS = [
  {
    id: 'dr_sakura_initial_consultation',
    name: 'Initial Breast Health Consultation',
    description: 'Practice handling first-time patient consultations about breast health concerns',
    category: 'health_coaching',
    difficulty: 'beginner',
    avatarType: 'dr_sakura',
    businessContext: 'health_coaching',
    estimatedDuration: 15,
    objectives: [
      'Establish rapport and trust with the patient',
      'Gather comprehensive health history',
      'Address initial concerns with empathy and professionalism',
      'Provide clear guidance on screening options',
      'Educate on breast self-examination techniques'
    ],
    customerPersona: 'First-time patient with general breast health questions',
    customerMood: 'slightly anxious',
    scenarioContext: {
      setting: 'Virtual health consultation',
      patientAge: '35-45',
      primaryConcern: 'General breast health and screening guidance'
    }
  },
  {
    id: 'dr_sakura_high_risk_consultation', 
    name: 'High-Risk Patient Consultation',
    description: 'Navigate complex conversations with patients who have elevated risk factors',
    category: 'health_coaching',
    difficulty: 'advanced',
    avatarType: 'dr_sakura',
    businessContext: 'health_coaching',
    estimatedDuration: 25,
    objectives: [
      'Explain risk factors clearly and sensitively',
      'Discuss genetic testing and family history implications',
      'Provide prevention strategies and lifestyle modifications',
      'Offer emotional support and reassurance',
      'Guide on enhanced screening protocols'
    ],
    customerPersona: 'Patient with family history of breast cancer',
    customerMood: 'worried',
    scenarioContext: {
      setting: 'Specialized consultation',
      patientAge: '30-50',
      primaryConcern: 'Family history and genetic risk factors'
    }
  },
  {
    id: 'dr_sakura_post_diagnosis_support',
    name: 'Post-Diagnosis Emotional Support',
    description: 'Support patients who have received concerning results or diagnosis',
    category: 'health_coaching', 
    difficulty: 'intermediate',
    avatarType: 'dr_sakura',
    businessContext: 'health_coaching',
    estimatedDuration: 20,
    objectives: [
      'Provide empathetic response to diagnosis news',
      'Explain next steps clearly and calmly',
      'Offer appropriate resources and support groups',
      'Address patient fears and concerns',
      'Guide through treatment planning process'
    ],
    customerPersona: 'Patient who has received abnormal screening results',
    customerMood: 'distressed',
    scenarioContext: {
      setting: 'Follow-up consultation',
      patientAge: '40-60',
      primaryConcern: 'Recent abnormal mammogram or biopsy results'
    }
  },
  {
    id: 'dr_sakura_lifestyle_counseling',
    name: 'Lifestyle & Prevention Counseling', 
    description: 'Guide patients on lifestyle changes for optimal breast health',
    category: 'health_coaching',
    difficulty: 'beginner',
    avatarType: 'dr_sakura',
    businessContext: 'health_coaching',
    estimatedDuration: 20,
    objectives: [
      'Discuss diet and exercise recommendations',
      'Explain hormone-related risk factors',
      'Guide on stress management techniques',
      'Provide actionable wellness plans',
      'Address lifestyle modification barriers'
    ],
    customerPersona: 'Health-conscious patient seeking prevention guidance',
    customerMood: 'motivated',
    scenarioContext: {
      setting: 'Wellness consultation',
      patientAge: '25-55',
      primaryConcern: 'Preventive health strategies'
    }
  },
  {
    id: 'dr_sakura_family_history_assessment',
    name: 'Family History Risk Assessment',
    description: 'Handle consultations involving detailed family history analysis',
    category: 'health_coaching',
    difficulty: 'intermediate', 
    avatarType: 'dr_sakura',
    businessContext: 'health_coaching',
    estimatedDuration: 30,
    objectives: [
      'Collect detailed family medical history',
      'Assess hereditary risk factors systematically',
      'Discuss genetic counseling options',
      'Provide personalized screening recommendations',
      'Address concerns about family risk transmission'
    ],
    customerPersona: 'Patient with complex family history of cancer',
    customerMood: 'concerned',
    scenarioContext: {
      setting: 'Risk assessment consultation',
      patientAge: '30-45',
      primaryConcern: 'Multiple family members with breast/ovarian cancer'
    }
  },
  {
    id: 'dr_sakura_young_adult_concerns',
    name: 'Young Adult Breast Health Education',
    description: 'Address breast health concerns and education for younger patients',
    category: 'health_coaching',
    difficulty: 'intermediate',
    avatarType: 'dr_sakura', 
    businessContext: 'health_coaching',
    estimatedDuration: 18,
    objectives: [
      'Address age-specific breast health concerns',
      'Educate on normal breast changes and development',
      'Discuss birth control and hormone effects',
      'Guide on when to seek medical attention',
      'Provide age-appropriate screening information'
    ],
    customerPersona: 'Young adult with breast health questions',
    customerMood: 'curious',
    scenarioContext: {
      setting: 'Educational consultation',
      patientAge: '18-30',
      primaryConcern: 'Normal breast changes and health awareness'
    }
  }
];

// Avatar types configuration
export const AVATAR_TYPES = [
  {
    id: 'dr_sakura',
    name: 'Dr. Sakura',
    description: 'Empathetic breast health specialist and wellness coach',
    businessContext: 'health_coaching',
    specialization: 'Breast health education, risk assessment, and emotional support',
    personality: 'warm, professional, evidence-based, empathetic',
    expertise: ['breast health', 'cancer prevention', 'wellness coaching', 'emotional support']
  }
];