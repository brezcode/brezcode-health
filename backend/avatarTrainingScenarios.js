// Original BrezCode Platform - Comprehensive AI Avatar Training Scenarios
// Based on industry research and best practices

// ===== AI AVATAR TYPES =====

export const AVATAR_TYPES = [
  {
    id: 'health_coach',
    name: 'Health & Wellness Coach',
    description: 'Specialized in health guidance, behavior change, and wellness program support',
    primarySkills: [
      'Motivational interviewing',
      'Health education',
      'Behavior change techniques',
      'Empathetic communication',
      'Goal setting',
      'Progress tracking',
      'Medical sensitivity'
    ],
    industries: ['Healthcare', 'Wellness', 'Fitness', 'Nutrition', 'Mental Health'],
    difficulty: 'intermediate',
    expectedOutcomes: [
      'Improve patient engagement',
      'Better health outcome tracking',
      'Enhanced motivational skills',
      'Increased program adherence'
    ]
  }
];

// ===== TRAINING SCENARIOS BY AVATAR TYPE =====

export const TRAINING_SCENARIOS = [
  // ===== DR. SAKURA BREAST HEALTH COACHING SCENARIOS =====
  {
    id: 'dr_sakura_initial_consultation',
    avatarType: 'health_coach',
    name: 'Initial Breast Health Consultation',
    description: 'First-time patient consultation about breast health concerns and prevention strategies',
    customerPersona: 'Sarah Chen, 40, marketing manager, no family history, heard painful stories from friends, very anxious about the unknown',
    customerMood: 'anxious',
    objectives: [
      'Establish rapport and trust with the patient',
      'Assess patient health history and concerns',
      'Provide evidence-based breast health education',
      'Address anxiety and misconceptions',
      'Create personalized prevention plan'
    ],
    timeframeMins: 20,
    difficulty: 'beginner',
    tags: ['consultation', 'anxiety', 'education', 'prevention'],
    industry: 'Healthcare',
    successCriteria: [
      'Patient feels heard and understood',
      'Comprehensive health history gathered',
      'Clear explanation of breast health basics provided',
      'Anxiety significantly reduced',
      'Follow-up plan established'
    ],
    commonMistakes: [
      'Rushing through the consultation',
      'Using too much medical jargon',
      'Not addressing emotional concerns',
      'Providing generic advice without personalization'
    ],
    keyLearningPoints: [
      'First consultations set the tone for long-term care',
      'Anxiety reduction is as important as information sharing',
      'Personalized approach improves patient engagement',
      'Building trust requires empathy and active listening'
    ]
  },
  {
    id: 'breast_screening_anxiety',
    avatarType: 'health_coach',
    name: 'First Mammogram Anxiety',
    description: 'Patient is terrified about her first mammogram and considering cancelling due to fear and anxiety',
    customerPersona: 'Sarah Chen, 40, marketing manager, no family history, heard painful stories from friends, very anxious about the unknown',
    customerMood: 'anxious',
    objectives: [
      'Validate anxiety while providing reassurance',
      'Explain mammogram process in simple terms',
      'Address pain and discomfort concerns',
      'Emphasize importance of early detection'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['mammogram', 'anxiety', 'first_screening', 'fear'],
    industry: 'Healthcare',
    successCriteria: [
      'Patient feels heard and understood',
      'Provided clear explanation of procedure',
      'Offered practical comfort tips',
      'Patient commits to keeping appointment'
    ],
    commonMistakes: [
      'Dismissing fears as irrational',
      'Using medical jargon',
      'Not acknowledging discomfort reality',
      'Rushing through explanation'
    ],
    keyLearningPoints: [
      'Acknowledge fear before education',
      'Use empathetic, gentle language',
      'Provide practical coping strategies',
      'Focus on empowerment through knowledge'
    ]
  },
  {
    id: 'family_history_concern',
    avatarType: 'health_coach', 
    name: 'Family History Breast Cancer Worry',
    description: 'Patient just learned her sister was diagnosed with breast cancer and is panicked about her own risk',
    customerPersona: 'Lisa Thompson, 35, teacher, sister recently diagnosed, feeling overwhelmed and scared about genetic risk',
    customerMood: 'urgent',
    objectives: [
      'Provide emotional support during crisis',
      'Explain family history risk factors clearly',
      'Discuss genetic testing options',
      'Create action plan for screening'
    ],
    timeframeMins: 20,
    difficulty: 'intermediate',
    tags: ['family_history', 'genetics', 'risk_assessment', 'crisis_support'],
    industry: 'Healthcare',
    successCriteria: [
      'Emotional state stabilized',
      'Risk factors explained accurately',
      'Clear next steps provided',
      'Patient feels empowered not helpless'
    ],
    commonMistakes: [
      'Providing false reassurance',
      'Overwhelming with statistics',
      'Not addressing emotional impact',
      'Delaying necessary referrals'
    ],
    keyLearningPoints: [
      'Balance hope with realistic information',
      'Family history increases but doesn\'t guarantee risk',
      'Early detection saves lives',
      'Support system is crucial'
    ]
  },
  {
    id: 'self_exam_guidance',
    avatarType: 'health_coach',
    name: 'Breast Self-Examination Teaching',
    description: 'Patient wants to learn proper self-examination technique but feels embarrassed and unsure',
    customerPersona: 'Amanda Rodriguez, 28, nurse, wants to be proactive but lacks confidence in technique, feels awkward about self-touch',
    customerMood: 'confused',
    objectives: [
      'Create comfortable learning environment',
      'Teach proper self-examination technique',
      'Address embarrassment and discomfort',
      'Establish regular self-exam routine'
    ],
    timeframeMins: 25,
    difficulty: 'beginner',
    tags: ['self_examination', 'technique', 'education', 'routine'],
    industry: 'Healthcare',
    successCriteria: [
      'Patient comfortable with discussion',
      'Demonstrated proper technique',
      'Addressed normal variations',
      'Committed to monthly routine'
    ],
    commonMistakes: [
      'Not addressing embarrassment',
      'Teaching too quickly',
      'Not explaining normal changes',
      'Skipping follow-up planning'
    ],
    keyLearningPoints: [
      'Normalize body awareness',
      'Technique matters for effectiveness',
      'Know your normal to detect changes',
      'Monthly routine after menstruation'
    ]
  },
  {
    id: 'lump_discovery_panic',
    avatarType: 'health_coach',
    name: 'Found a Lump - Crisis Management',
    description: 'Patient found a lump during self-exam and is in complete panic, needs immediate guidance and support',
    customerPersona: 'Jennifer Walsh, 45, mother of two, found lump yesterday, couldn\'t sleep, assuming the worst, needs urgent support',
    customerMood: 'urgent',
    objectives: [
      'Provide immediate emotional support',
      'Guide through next steps calmly',
      'Explain that most lumps are benign',
      'Facilitate prompt medical evaluation'
    ],
    timeframeMins: 20,
    difficulty: 'advanced',
    tags: ['lump_discovery', 'crisis', 'urgent_care', 'emotional_support'],
    industry: 'Healthcare',
    successCriteria: [
      'Panic level reduced significantly',
      'Clear action plan established',
      'Appointment scheduled promptly',
      'Support system activated'
    ],
    commonMistakes: [
      'False reassurance without examination',
      'Not validating extreme fear',
      'Delaying medical referral',
      'Providing diagnostic opinions'
    ],
    keyLearningPoints: [
      'Most breast lumps are not cancer',
      'Immediate evaluation is important',
      'Support system crucial during waiting',
      'Stay within scope of practice'
    ]
  },
  {
    id: 'menopause_breast_changes',
    avatarType: 'health_coach',
    name: 'Menopause and Breast Health Changes',
    description: 'Patient experiencing breast changes during menopause and worried about increased cancer risk',
    customerPersona: 'Patricia Kim, 52, executive, going through menopause, noticing breast density changes, concerned about hormone therapy effects',
    customerMood: 'skeptical',
    objectives: [
      'Explain normal menopausal breast changes',
      'Discuss hormone therapy implications',
      'Address screening modifications needed',
      'Provide lifestyle recommendations'
    ],
    timeframeMins: 18,
    difficulty: 'intermediate',
    tags: ['menopause', 'hormones', 'breast_density', 'lifestyle'],
    industry: 'Healthcare',
    successCriteria: [
      'Normal changes explained clearly',
      'Hormone risks/benefits discussed',
      'Screening plan updated',
      'Lifestyle modifications planned'
    ],
    commonMistakes: [
      'Not explaining hormone complexity',
      'Dismissing valid concerns',
      'Generic lifestyle advice',
      'Not coordinating with physician'
    ],
    keyLearningPoints: [
      'Menopause affects breast tissue',
      'Personalized risk assessment needed',
      'Collaborative care approach',
      'Lifestyle factors matter at any age'
    ]
  },
  {
    id: 'young_adult_education',
    avatarType: 'health_coach',
    name: 'Young Adult Breast Health Education',
    description: 'College student wants to learn about breast health but feels it\'s not relevant at her age',
    customerPersona: 'Emma Johnson, 20, college student, thinks breast cancer only affects older women, wants basic education',
    customerMood: 'calm',
    objectives: [
      'Provide age-appropriate education',
      'Establish healthy habits early',
      'Address young adult risk factors',
      'Create foundation for lifelong awareness'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['young_adult', 'prevention', 'education', 'habits'],
    industry: 'Healthcare',
    successCriteria: [
      'Age-appropriate information provided',
      'Early habits encouraged',
      'Risk factors understood',
      'Foundation for future awareness'
    ],
    commonMistakes: [
      'Too much focus on cancer risk',
      'Not making it relevant to age',
      'Overwhelming with information',
      'Not encouraging questions'
    ],
    keyLearningPoints: [
      'Early education builds lifelong habits',
      'Young women can develop breast awareness',
      'Risk factors exist at all ages',
      'Prevention starts early'
    ]
  },

  // ===== HIGH-RISK CONSULTATION SCENARIOS =====
  {
    id: 'health_high_risk_consultation',
    avatarType: 'health_coach',
    name: 'High-Risk Patient Consultation',
    description: 'Navigate complex conversations with patients who have elevated risk factors',
    customerPersona: 'Patient with family history of illness',
    customerMood: 'worried',
    objectives: [
      'Explain risk factors clearly and sensitively',
      'Discuss genetic testing and family history',
      'Provide prevention strategies',
      'Offer emotional support and reassurance',
      'Guide on enhanced monitoring protocols'
    ],
    timeframeMins: 25,
    difficulty: 'advanced',
    tags: ['healthcare', 'high-risk', 'genetics', 'counseling'],
    industry: 'Healthcare',
    successCriteria: [
      'Risk factors communicated clearly',
      'Patient anxiety managed effectively',
      'Comprehensive prevention plan developed',
      'Appropriate referrals made'
    ],
    commonMistakes: [
      'Being too technical with explanations',
      'Not addressing emotional needs',
      'Overwhelming patient with statistics',
      'Missing referral opportunities'
    ],
    keyLearningPoints: [
      'High-risk doesn\'t mean inevitable',
      'Emotional support is crucial',
      'Prevention strategies can be empowering',
      'Team-based care approach works best'
    ]
  }
];

// ===== SCENARIO SELECTION HELPERS =====

export function getScenariosByAvatarType(avatarType) {
  return TRAINING_SCENARIOS.filter(scenario => scenario.avatarType === avatarType);
}

export function getScenariosByDifficulty(difficulty) {
  return TRAINING_SCENARIOS.filter(scenario => scenario.difficulty === difficulty);
}

export function getScenariosByIndustry(industry) {
  return TRAINING_SCENARIOS.filter(scenario => scenario.industry === industry);
}

export function getAvatarTypeById(id) {
  return AVATAR_TYPES.find(avatar => avatar.id === id);
}

// ===== PROGRESSIVE TRAINING PATHS =====

export const TRAINING_PATHS = {
  health_coach: [
    'dr_sakura_initial_consultation',
    'breast_screening_anxiety',
    'family_history_concern',
    'self_exam_guidance',
    'lump_discovery_panic',
    'menopause_breast_changes',
    'young_adult_education',
    'health_high_risk_consultation'
  ]
};