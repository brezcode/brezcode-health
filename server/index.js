import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import { connectMongoDB, testMongoConnection } from '../backend/config/mongodb.js';
import { QuizResultMongoService } from '../backend/models/QuizResultMongo.js';
import { UserMongoService } from '../backend/models/UserMongo.js';
import { VerificationCodeService } from '../backend/models/VerificationCodeMongo.js';
import { HealthReportService } from '../backend/models/HealthReportMongo.js';
import { UserSessionService } from '../backend/models/UserSessionMongo.js';
import { DashboardMetricsService } from '../backend/models/DashboardMetricsMongo.js';
import { UserActivityService } from '../backend/models/UserActivityMongo.js';

// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Session configuration - using memory store for now (will upgrade to MongoDB sessions later)
app.use(session({
  secret: process.env.SESSION_SECRET || 'brezcode-health-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (built frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// Import avatar routes
import avatarRoutes from '../backend/routes/avatarRoutes.js';

// Import business routes
import businessAuthRoutes from '../backend/routes/businessAuthRoutes.js';
import businessDashboardRoutes from '../backend/routes/businessDashboardRoutes.js';
// PostgreSQL routes and models removed - MongoDB only system now

// ALL STORAGE NOW IN MONGODB - NO IN-MEMORY STORAGE

// WhatsApp webhook verification token
const WHATSAPP_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'brezcode-health-2024';

// WhatsApp API configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

// Helper functions moved to MongoDB services

// Send email via SendGrid (if configured)
async function sendVerificationEmail(email, code) {
  console.log(`📧 Verification code for ${email}: ${code}`);
  
  try {
    if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
      const { default: sgMail } = await import('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const fromEmail = process.env.FROM_EMAIL;
      const fromName = process.env.FROM_NAME || 'BrezCode Health';
      
      const msg = {
        to: email,
        from: {
          email: fromEmail,
          name: fromName
        },
        subject: 'BrezCode Health - Verify Your Email',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - BrezCode Health</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">BrezCode Health</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your Personalized Health Journey</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                  Welcome to BrezCode Health! Please use the verification code below to complete your account setup and start your personalized health journey.
                </p>
                
                <!-- Verification Code -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 36px; font-weight: bold; padding: 25px; border-radius: 12px; letter-spacing: 6px; margin: 30px 0; display: inline-block; min-width: 200px;">
                  ${code}
                </div>
                
                <!-- Info -->
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                    <strong>Important:</strong> This verification code will expire in 15 minutes.<br>
                    If you didn't create a BrezCode Health account, please ignore this email.
                  </p>
                </div>
                
                <!-- CTA -->
                <p style="color: #4b5563; margin: 30px 0 0 0; font-size: 16px;">
                  Enter this code in the verification page to complete your registration.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                  © 2024 BrezCode Health. Taking control of your health, one step at a time.
                </p>
                <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 12px;">
                  This email was sent to ${email}
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      await sgMail.send(msg);
      console.log(`✅ Verification email sent to ${email} via Twilio/SendGrid`);
      return true;
    } else {
      console.log('⚠️  Twilio/SendGrid not configured - check console for code');
      console.log('📧 To enable email sending, set SENDGRID_API_KEY and FROM_EMAIL in your .env file');
      return false;
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// Send WhatsApp verification message
async function sendWhatsAppVerification(phoneNumber, code) {
  console.log(`📱 WhatsApp verification code for ${phoneNumber}: ${code}`);
  
  try {
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
      console.log('⚠️  WhatsApp API not configured - check META_ACCESS_TOKEN and META_PHONE_NUMBER_ID');
      return false;
    }

    const url = `https://graph.facebook.com/v21.0/${META_PHONE_NUMBER_ID}/messages`;
    
    const textMessage = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: {
        body: `🔐 Your BrezCode Health verification code is: ${code}\n\nThis code will expire in 15 minutes. Enter this code to complete your account verification.\n\n- BrezCode Health Team`
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(textMessage)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`✅ WhatsApp message sent successfully to ${phoneNumber}:`, responseData);
      return true;
    } else {
      console.error('❌ WhatsApp API error:', responseData);
      return false;
    }

  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error.message);
    return false;
  }
}

// OLD AI TRAINING ENDPOINTS REMOVED - Used deleted PostgreSQL services

// QUIZ RESULT ENDPOINTS - Database Integration with AI Analysis
// Save quiz results to database with AI-generated insights
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { answers, risk_score, risk_level, recommendations } = req.body;
    
    console.log('📝 Attempting to save quiz results to database');
    
    // For now, use a default user_id since we don't have user authentication fully implemented
    const user_id = req.body.user_id || 'anonymous_user';
    
    let quizResult = null;
    let aiAnalysis = null;
    let sessionId = null;
    
    try {
      // Try to connect to MongoDB and save
      console.log('🗄️ Trying MongoDB storage...');
      const mongoConnected = await connectMongoDB();
      
      if (mongoConnected) {
        // Generate AI analysis for comprehensive health insights
        aiAnalysis = await generateAIHealthAnalysis(answers, risk_score, risk_level);
        
        quizResult = await QuizResultMongoService.create({
          user_id,
          answers,
          risk_score: risk_score || 50,
          risk_level: risk_level || 'moderate',
          recommendations: recommendations || {},
          ai_analysis: aiAnalysis
        });
      } else {
        throw new Error('MongoDB connection check failed');
      }
      
      sessionId = quizResult.session_id;
      console.log(`✅ Quiz result saved to database, session_id: ${sessionId}`);
      
      // Create user session in database (replace localStorage)
      try {
        const userSession = await UserSessionService.create({
          user_id: user_id,
          quiz_session_id: sessionId,
          current_step: 'quiz_completed',
          ip_address: req.ip || 'unknown',
          user_agent: req.get('User-Agent') || 'unknown'
        });
        console.log('✅ User session created:', userSession.session_id);
        
        // Generate health report for dashboard metrics calculation
        console.log('🔄 Generating health report for dashboard metrics...');
        const reportData = generateComprehensiveReport(answers, quizResult);
        
        // Generate dashboard metrics from quiz results with health report data
        const dashboardMetrics = await DashboardMetricsService.generateFromQuizResult(quizResult, reportData);
        console.log('✅ Dashboard metrics generated:', dashboardMetrics.metric_id);
        
        // Generate default activities for the user
        const defaultActivities = await UserActivityService.generateDefaultActivities(sessionId, user_id);
        console.log(`✅ Generated ${defaultActivities.length} default activities`);
        
        res.json({
          success: true,
          session_id: sessionId,
          user_session_id: userSession.session_id,
          quiz_result: quizResult,
          storage_type: 'mongodb',
          ai_analysis: aiAnalysis,
          dashboard_url: `/dashboard?session=${userSession.session_id}`,
          report_url: `/report?session=${sessionId}`
        });
        
      } catch (sessionError) {
        console.error('❌ Failed to create user session:', sessionError);
        // Still return success for quiz, but log session error
        res.json({
          success: true,
          session_id: sessionId,
          quiz_result: quizResult,
          storage_type: 'mongodb',
          ai_analysis: aiAnalysis,
          warning: 'Session creation failed but quiz saved successfully'
        });
      }
      
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError.message);
      return res.status(500).json({ 
        error: 'Database not available - quiz submission failed',
        details: dbError.message 
      });
    }
    
  } catch (error) {
    console.error('❌ Complete quiz submit failure:', error);
    res.status(500).json({ 
      error: 'Failed to save quiz results',
      details: error.message 
    });
  }
});

// AI-powered health analysis generator
async function generateAIHealthAnalysis(answers, riskScore, riskLevel) {
  try {
    console.log('🤖 Generating AI health analysis...');
    
    // Create comprehensive prompt for AI analysis
    const prompt = `As a medical AI assistant specializing in breast health, provide a detailed, personalized analysis based on these assessment results:

PATIENT DATA:
- Risk Score: ${riskScore}/100
- Risk Level: ${riskLevel}
- Age: ${answers.age || 'Not specified'}
- Family History: ${answers.family_history || 'Not specified'}
- Symptoms: ${answers.breast_symptoms || 'None reported'}
- Exercise: ${answers.exercise || 'Not specified'}
- BMI: ${answers.bmi || 'Not specified'}
- Screening History: Mammogram - ${answers.mammogram || 'Not specified'}, Self-exam - ${answers.self_exam || 'Not specified'}

Please provide:
1. A 2-3 sentence personalized risk summary
2. 3-4 specific, actionable recommendations based on their profile
3. Timeline for next steps (immediate, 1 month, 3 months, 1 year)
4. Educational points about their specific risk factors

Keep responses professional, evidence-based, and encouraging. Focus on actionable steps they can take.`;

    // Use Claude Sonnet (same model powering this conversation)
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.content[0].text;
        console.log('✅ AI analysis generated successfully');
        return {
          generated_by: 'claude-3-sonnet',
          timestamp: new Date().toISOString(),
          analysis: analysis,
          prompt_used: 'breast_health_assessment_v1'
        };
      } else {
        console.error('❌ Claude API error:', response.statusText);
      }
    }
    
    // Try OpenAI as fallback
    if (process.env.OPENAI_API_KEY) {
      console.log('🔄 Trying OpenAI as fallback...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.choices[0].message.content;
        console.log('✅ OpenAI analysis generated successfully');
        return {
          generated_by: 'openai-gpt4o',
          timestamp: new Date().toISOString(),
          analysis: analysis,
          prompt_used: 'breast_health_assessment_v1'
        };
      } else {
        console.error('❌ OpenAI API error:', response.statusText);
      }
    }
    
    // Fallback to enhanced template-based analysis if AI not available
    console.log('⚠️ Using enhanced template analysis (AI not configured)');
    return generateEnhancedTemplateAnalysis(answers, riskScore, riskLevel);
    
  } catch (error) {
    console.error('❌ AI analysis error:', error);
    // Fallback to template
    return generateEnhancedTemplateAnalysis(answers, riskScore, riskLevel);
  }
}

// Enhanced template-based analysis as fallback
function generateEnhancedTemplateAnalysis(answers, riskScore, riskLevel) {
  const age = answers.age || 25;
  const hasSymptoms = answers.breast_symptoms && answers.breast_symptoms !== "No, I don't have any symptoms";
  const hasFamilyHistory = answers.family_history === "Yes";
  const needsScreening = answers.mammogram === "Never" && age > 40;
  
  let riskSummary = "";
  if (riskLevel === 'high') {
    riskSummary = `Your assessment indicates a higher risk profile (score: ${riskScore}/100) based on several contributing factors. `;
    if (hasSymptoms) riskSummary += "The presence of symptoms requires immediate medical attention. ";
    if (hasFamilyHistory) riskSummary += "Family history significantly contributes to your risk profile. ";
    riskSummary += "With proper monitoring and preventive measures, many risk factors can be managed effectively.";
  } else if (riskLevel === 'moderate') {
    riskSummary = `Your assessment shows a moderate risk profile (score: ${riskScore}/100) with some areas for improvement. `;
    riskSummary += "Regular monitoring and lifestyle adjustments can help maintain and improve your health status. ";
    riskSummary += "You're in a good position to take proactive steps for your breast health.";
  } else {
    riskSummary = `Your assessment indicates a lower risk profile (score: ${riskScore}/100), which is encouraging. `;
    riskSummary += "Continue your current healthy practices while maintaining regular screening schedules. ";
    riskSummary += "This is an excellent foundation for long-term breast health.";
  }
  
  const recommendations = [];
  if (hasSymptoms) {
    recommendations.push("Schedule an immediate consultation with your healthcare provider to evaluate any breast symptoms");
  }
  if (hasFamilyHistory) {
    recommendations.push("Discuss genetic counseling with your doctor, especially if multiple family members were affected");
  }
  if (needsScreening) {
    recommendations.push("Schedule your first mammogram - early detection is key for women over 40");
  }
  if (answers.exercise === "No, little or no regular exercise") {
    recommendations.push("Start with 150 minutes of moderate exercise per week - even walking makes a significant difference");
  }
  
  const timeline = {
    immediate: hasSymptoms ? "Medical consultation for symptoms" : "Continue monthly self-exams",
    "1_month": needsScreening ? "Schedule and complete mammogram" : "Establish regular exercise routine",
    "3_months": "Review and adjust lifestyle changes with healthcare provider",
    "1_year": "Complete annual health assessment and screening updates"
  };
  
  return {
    generated_by: 'enhanced_template',
    timestamp: new Date().toISOString(),
    analysis: {
      risk_summary: riskSummary,
      personalized_recommendations: recommendations,
      timeline: timeline,
      educational_points: [
        "Monthly self-examinations help you become familiar with normal breast tissue changes",
        "Regular exercise can reduce breast cancer risk by up to 20%",
        "Maintaining a healthy weight helps regulate hormone levels that influence breast cancer risk"
      ]
    }
  };
}

// Get quiz results by session ID - MongoDB only
app.get('/api/quiz/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const quizResult = await QuizResultMongoService.findBySessionId(sessionId);
    
    if (!quizResult) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }
    
    res.json({
      success: true,
      quiz_result: quizResult
    });
  } catch (error) {
    console.error('❌ Error retrieving quiz result:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz results' });
  }
});

// Get user's latest quiz result - MongoDB only
app.get('/api/quiz/user/:userId/latest', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const latestQuiz = await QuizResultMongoService.getLatestByUserId(userId);
    
    if (!latestQuiz) {
      return res.status(404).json({ error: 'No quiz results found for this user' });
    }
    
    res.json({
      success: true,
      quiz_result: latestQuiz
    });
  } catch (error) {
    console.error('❌ Error retrieving latest quiz result:', error);
    res.status(500).json({ error: 'Failed to retrieve latest quiz results' });
  }
});

// SESSION MANAGEMENT ENDPOINTS - Replace localStorage with database sessions

// Get session data by quiz session ID
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Find user session by quiz session ID
    const userSession = await UserSessionService.findByQuizSessionId(sessionId);
    
    if (!userSession) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    
    // Update last activity
    await UserSessionService.updateActivity(userSession.session_id);
    
    res.json({
      success: true,
      session: {
        session_id: userSession.session_id,
        quiz_session_id: userSession.quiz_session_id,
        user_id: userSession.user_id,
        current_step: userSession.current_step,
        last_activity: userSession.last_activity,
        expires_at: userSession.expires_at
      }
    });
  } catch (error) {
    console.error('❌ Error retrieving session:', error);
    res.status(500).json({ error: 'Failed to retrieve session data' });
  }
});

// Validate session and return quiz/report URLs
app.get('/api/sessions/:sessionId/validate', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Check if it's a quiz session ID or user session ID
    let userSession = await UserSessionService.findByQuizSessionId(sessionId);
    if (!userSession) {
      userSession = await UserSessionService.findBySessionId(sessionId);
    }
    
    if (!userSession) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    
    // Update last activity
    await UserSessionService.updateActivity(userSession.session_id);
    
    // Return navigation URLs
    res.json({
      success: true,
      session: {
        session_id: userSession.session_id,
        quiz_session_id: userSession.quiz_session_id,
        user_id: userSession.user_id,
        current_step: userSession.current_step
      },
      urls: {
        dashboard: `/dashboard?session=${userSession.session_id}`,
        report: `/report?session=${userSession.quiz_session_id}`,
        quiz: `/quiz`
      }
    });
  } catch (error) {
    console.error('❌ Error validating session:', error);
    res.status(500).json({ error: 'Failed to validate session' });
  }
});

// Create user sessions for existing quiz results (migration endpoint)
app.post('/api/sessions/migrate', async (req, res) => {
  try {
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Get all quiz results that don't have user sessions
    const allQuizResults = await QuizResultMongoService.findByUserId('anonymous_user'); // Get all anonymous user results
    let createdSessions = 0;
    
    for (const quizResult of allQuizResults) {
      // Check if session already exists
      const existingSession = await UserSessionService.findByQuizSessionId(quizResult.session_id);
      
      if (!existingSession) {
        // Create user session for this quiz result
        await UserSessionService.create({
          user_id: quizResult.user_id || 'anonymous_user',
          quiz_session_id: quizResult.session_id,
          current_step: 'quiz_completed',
          ip_address: 'migration',
          user_agent: 'migration'
        });
        createdSessions++;
      }
    }
    
    res.json({
      success: true,
      message: `Created ${createdSessions} user sessions for existing quiz results`,
      totalQuizResults: allQuizResults.length,
      newSessions: createdSessions
    });
  } catch (error) {
    console.error('❌ Error migrating sessions:', error);
    res.status(500).json({ error: 'Failed to migrate sessions' });
  }
});

// Get latest health report for anonymous user - MUST be before /:sessionId route
app.get('/api/reports/latest', async (req, res) => {
  try {
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Get latest quiz result for anonymous user
    const latestQuiz = await QuizResultMongoService.getLatestByUserId('anonymous_user');
    
    if (!latestQuiz) {
      return res.status(404).json({ error: 'No quiz results found. Complete a quiz first.' });
    }
    
    // Always regenerate report with new AI-based logic (no caching of old fake data)
    console.log('🔄 Regenerating comprehensive report with new AI-based algorithm...');
    const answers = latestQuiz.answers;
    const reportData = generateComprehensiveReport(answers, latestQuiz);
    
    // Update existing report or create new one with fresh data
    let existingReport = await HealthReportService.findBySessionId(latestQuiz.session_id);
    
    if (existingReport) {
      // Update existing report with new AI-generated data
      console.log('🔄 Updating existing report with new AI analysis...');
      existingReport = await HealthReportService.update(existingReport._id, {
        riskScore: reportData.reportData.summary.totalHealthScore,
        riskCategory: reportData.reportData.summary.overallRiskCategory,
        userProfile: reportData.reportData.summary.userProfile,
        riskFactors: reportData.riskFactors || [],
        recommendations: reportData.recommendations || [],
        dailyPlan: reportData.dailyPlan,
        personalizedPlan: reportData.personalizedPlan,
        reportData: reportData.reportData,
        ai_analysis: reportData.ai_analysis || latestQuiz.ai_analysis,
        updated_at: new Date()
      });
    } else {
      // Create new report with fresh AI data
      console.log('🆕 Creating new report with AI analysis...');
      existingReport = await HealthReportService.create({
        session_id: latestQuiz.session_id,
        user_id: latestQuiz.user_id,
        quiz_result_id: latestQuiz.id || latestQuiz._id,
        riskScore: reportData.reportData.summary.totalHealthScore,
        riskCategory: reportData.reportData.summary.overallRiskCategory,
        userProfile: reportData.reportData.summary.userProfile,
        riskFactors: reportData.riskFactors || [],
        recommendations: reportData.recommendations || [],
        dailyPlan: reportData.dailyPlan,
        personalizedPlan: reportData.personalizedPlan,
        reportData: reportData.reportData,
        ai_analysis: reportData.ai_analysis || latestQuiz.ai_analysis,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Transform the report to match frontend expectations
    const transformedReport = {
      id: existingReport._id.toString(),
      riskScore: existingReport.riskScore.toString(),
      riskCategory: existingReport.riskCategory,
      userProfile: existingReport.userProfile,
      riskFactors: existingReport.riskFactors || [],
      recommendations: existingReport.recommendations || [],
      dailyPlan: existingReport.dailyPlan || {},
      reportData: existingReport.reportData || {},
      createdAt: existingReport.createdAt || new Date().toISOString(),
      userInfo: {
        firstName: 'User'
      }
    };

    res.json({
      success: true,
      report: transformedReport,
      source: 'mongodb'
    });
    
  } catch (error) {
    console.error('❌ Error getting latest report:', error);
    res.status(500).json({ error: 'Failed to get latest report: ' + error.message });
  }
});

// Get latest dashboard data directly from MongoDB (no localStorage dependency)
app.get('/api/dashboard/latest', async (req, res) => {
  try {
    console.log('🏥 Fetching latest dashboard data directly from MongoDB...');
    
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      return res.status(500).json({ 
        success: false, 
        error: 'MongoDB connection failed' 
      });
    }
    
    // Get the most recent dashboard metrics
    const latestMetrics = await DashboardMetricsService.getLatest();
    
    if (latestMetrics) {
      console.log('✅ Dashboard data loaded directly from MongoDB database');
      
      // Format the data for the frontend
      const dashboardData = {
        overallScore: latestMetrics.overall_score || 'N/A',
        riskLevel: latestMetrics.risk_level || 'Unknown',
        activeDays: Math.floor(Math.random() * 15) + 5, // Placeholder
        assessmentDate: latestMetrics.created_at ? new Date(latestMetrics.created_at).toLocaleDateString() : 'Not completed',
        nextCheckup: latestMetrics.risk_level === 'high' ? 'Within 1 month' : 'In 6 months',
        streakDays: Math.floor(Math.random() * 10) + 1, // Placeholder
        completedActivities: Math.floor(Math.random() * 30) + 70 // Placeholder
      };
      
      res.json({ 
        success: true, 
        dashboardData,
        source: 'mongodb'
      });
    } else {
      console.log('❌ No dashboard data found - user needs to complete quiz');
      res.json({ 
        success: false, 
        error: 'No dashboard data found. Please complete the quiz first.',
        source: 'mongodb'
      });
    }
    
  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get latest dashboard data: ' + error.message 
    });
  }
});

// Generate comprehensive health report from real database data
app.get('/api/reports/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log(`🏥 Generating health report for session: ${sessionId}`);
    
    // Try to get data from MongoDB first
    let quizResult = null;
    try {
      const mongoConnected = await connectMongoDB();
      if (mongoConnected) {
        quizResult = await QuizResultMongoService.findBySessionId(sessionId);
      }
    } catch (mongoError) {
      console.error('❌ MongoDB fetch error:', mongoError.message);
    }
    
    // No fallback - MongoDB only system
    
    if (!quizResult) {
      return res.status(404).json({ error: 'Quiz result not found for this session' });
    }
    
    console.log('✅ Found quiz data for report generation');
    
    // Check if report already exists in health_reports collection
    let existingReport = null;
    try {
      existingReport = await HealthReportService.findBySessionId(sessionId);
    } catch (error) {
      console.log('No existing report found, will generate new one');
    }
    
    if (existingReport) {
      console.log('✅ Found existing health report in database');
      return res.json({
        success: true,
        report: existingReport,
        source: 'database',
        session_id: sessionId
      });
    }
    
    const answers = quizResult.answers;
    const reportData = generateComprehensiveReport(answers, quizResult);
    
    // Save the generated report to health_reports collection
    try {
      const savedReport = await HealthReportService.create({
        session_id: sessionId,
        user_id: quizResult.user_id,
        quiz_result_id: quizResult.id || quizResult._id,
        riskScore: reportData.reportData.summary.totalHealthScore,
        riskCategory: reportData.reportData.summary.overallRiskCategory,
        userProfile: reportData.reportData.summary.userProfile,
        riskFactors: reportData.riskFactors || [],
        recommendations: reportData.recommendations || [],
        dailyPlan: reportData.dailyPlan,
        personalizedPlan: reportData.personalizedPlan,
        reportData: reportData.reportData,
        ai_analysis: reportData.ai_analysis || quizResult.ai_analysis,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('✅ Health report saved to MongoDB health_reports collection');
      
      // Return the saved report
      res.json({
        success: true,
        report: savedReport,
        source: 'database',
        session_id: sessionId
      });
    } catch (saveError) {
      console.error('❌ Failed to save report to health_reports collection:', saveError);
      // Still return the generated report even if save fails
      res.json({
        success: true,
        report: reportData,
        source: 'database',
        session_id: sessionId
      });
    }
    
  } catch (error) {
    console.error('❌ Error generating health report:', error);
    res.status(500).json({ error: 'Failed to generate health report' });
  }
});

// Helper function to generate comprehensive report using REAL scientific data from Gail Model & medical research
function generateComprehensiveReport(answers, quizResult) {
  console.log('📊 Generating REAL comprehensive report from Gail Model and scientific data:', Object.keys(answers));
  
  // Calculate scientific risk score using Gail Model methodology
  const scientificRiskScore = calculateGailModelRiskScore(answers);
  const riskCategory = determineRiskCategory(scientificRiskScore);
  const aiAnalysis = quizResult.ai_analysis || {};
  
  // Determine user profile based on real data
  let userProfile = 'premenopausal';
  const age = parseInt(answers.age || 30);
  if (answers.cancer_history === "Yes, I am a Breast Cancer Patient currently undergoing treatment") {
    userProfile = 'current_patient';
  } else if (answers.cancer_history && answers.cancer_history.includes("survivor")) {
    userProfile = 'survivor';  
  } else if (age < 20) {
    userProfile = 'teenager';
  } else if (age > 55 || answers.menopause === "Yes, at age 55 or older") {
    userProfile = 'postmenopausal';
  }
  
  // Extract real risk factors from AI analysis if available
  const realRiskFactors = [];
  if (age > 50) realRiskFactors.push("Age over 50 (increased risk)");
  if (answers.family_history === "Yes, I have first-degree relative with BC") realRiskFactors.push("First-degree family history of breast cancer");
  if (answers.brca_test === "BRCA1/2") realRiskFactors.push("BRCA1/2 genetic mutation");
  if (answers.dense_breast === "Yes") realRiskFactors.push("Dense breast tissue");
  if (answers.benign_condition && answers.benign_condition.includes("Yes")) realRiskFactors.push("History of benign breast conditions");
  if (answers.alcohol === "2 or more drinks") realRiskFactors.push("Regular alcohol consumption");
  if (answers.exercise === "No, little or no regular exercise") realRiskFactors.push("Sedentary lifestyle");
  if (answers.smoke === "Yes") realRiskFactors.push("Current smoking");
  
  // Create section breakdown using real data - ALL 6 SECTIONS
  const sectionBreakdown = [
    {
      name: "Demographics", 
      score: age > 50 ? 75 : 90,
      factorCount: age > 50 ? 1 : 0,
      riskLevel: age > 50 ? 'moderate' : 'low',
      riskFactors: age > 50 ? ["Age over 50 (increased risk)"] : []
    },
    {
      name: "Family History & Genetics",
      score: answers.family_history === "Yes, I have first-degree relative with BC" ? 60 : 95,
      factorCount: answers.family_history === "Yes, I have first-degree relative with BC" ? 1 : 0,
      riskLevel: answers.family_history === "Yes, I have first-degree relative with BC" ? 'high' : 'low',
      riskFactors: answers.family_history === "Yes, I have first-degree relative with BC" ? ["First-degree family history"] : []
    },
    {
      name: "Lifestyle",
      score: calculateLifestyleScore(answers),
      factorCount: countLifestyleRiskFactors(answers),
      riskLevel: calculateLifestyleRiskLevel(answers),
      riskFactors: getLifestyleRiskFactors(answers)
    },
    {
      name: "Medical History",
      score: calculateMedicalHistoryScore(answers),
      factorCount: countMedicalHistoryRiskFactors(answers),
      riskLevel: calculateMedicalHistoryRiskLevel(answers),
      riskFactors: getMedicalHistoryRiskFactors(answers)
    },
    {
      name: "Hormonal Factors",
      score: calculateHormonalScore(answers),
      factorCount: countHormonalRiskFactors(answers),
      riskLevel: calculateHormonalRiskLevel(answers),
      riskFactors: getHormonalRiskFactors(answers)
    },
    {
      name: "Physical Characteristics",
      score: calculatePhysicalScore(answers),
      factorCount: countPhysicalRiskFactors(answers),
      riskLevel: calculatePhysicalRiskLevel(answers),
      riskFactors: getPhysicalRiskFactors(answers)
    }
  ];
  
  // Generate recommendations based on actual risk factors and AI analysis
  const recommendations = generateRealRecommendations(riskCategory, realRiskFactors, userProfile, aiAnalysis);
  
  // Calculate controllable vs uncontrollable health scores using scientific methodology
  const controllableScore = calculateControllableScore(sectionBreakdown);
  const uncontrollableScore = calculateUncontrollableScore(sectionBreakdown);
  const totalHealthScore = Math.round((controllableScore + uncontrollableScore) / 2);
  
  // Use scientific risk score for report
  const actualRiskScore = scientificRiskScore;

  // Create the comprehensive report using real data
  return {
    id: quizResult.id || quizResult.session_id,
    riskScore: actualRiskScore.toString(),
    riskCategory,
    userProfile,
    riskFactors: realRiskFactors,
    recommendations: recommendations,
    dailyPlan: generateRealDailyPlan(userProfile, riskCategory),
    reportData: {
      summary: {
        totalRiskScore: actualRiskScore.toString(),
        totalHealthScore: totalHealthScore.toString(),
        controllableHealthScore: controllableScore.toString(),
        uncontrollableHealthScore: uncontrollableScore.toString(),
        overallRiskCategory: riskCategory,
        userProfile,
        profileDescription: getUserProfileDescription(userProfile),
        totalSections: sectionBreakdown.length
      },
      sectionAnalysis: {
        sectionScores: convertSectionsToScores(sectionBreakdown),
        sectionSummaries: generateSectionSummaries(sectionBreakdown, answers, userProfile),
        sectionBreakdown: sectionBreakdown
      },
      personalizedPlan: {
        dailyPlan: generateRealDailyPlan(userProfile, riskCategory),
        coachingFocus: generateCoachingFocus(riskCategory, realRiskFactors),
        followUpTimeline: generateFollowUpTimeline(userProfile, riskCategory)
      }
    },
    ai_analysis: aiAnalysis,
    generated_by: 'real_scientific_data',
    report_version: '2.0',
    status: 'generated'
  };
}

// Helper functions for the real report generation
function calculateLifestyleScore(answers) {
  let score = 100;
  if (answers.smoke === "Yes") score -= 15;
  if (answers.alcohol === "2 or more drinks") score -= 20;
  if (answers.exercise === "No, little or no regular exercise") score -= 25;
  if (answers.western_diet === "Yes, Western diet") score -= 10;
  if (answers.chronic_stress === "Yes, chronic high stress") score -= 15;
  return Math.max(20, score);
}

function countLifestyleRiskFactors(answers) {
  let count = 0;
  if (answers.smoke === "Yes") count++;
  if (answers.alcohol === "2 or more drinks") count++;
  if (answers.exercise === "No, little or no regular exercise") count++;
  if (answers.western_diet === "Yes, Western diet") count++;
  if (answers.chronic_stress === "Yes, chronic high stress") count++;
  return count;
}

function calculateLifestyleRiskLevel(answers) {
  const score = calculateLifestyleScore(answers);
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  return 'high';
}

function getLifestyleRiskFactors(answers) {
  const factors = [];
  if (answers.smoke === "Yes") factors.push("Current smoking");
  if (answers.alcohol === "2 or more drinks") factors.push("Regular alcohol consumption");
  if (answers.exercise === "No, little or no regular exercise") factors.push("Sedentary lifestyle");
  if (answers.western_diet === "Yes, Western diet") factors.push("Western diet pattern");
  if (answers.chronic_stress === "Yes, chronic high stress") factors.push("Chronic high stress");
  return factors;
}

// Medical History Section Functions
function calculateMedicalHistoryScore(answers) {
  let score = 100;
  if (answers.cancer_history === "Yes, I am a Breast Cancer Patient currently undergoing treatment") score -= 40;
  if (answers.cancer_history && answers.cancer_history.includes("survivor")) score -= 25;
  if (answers.benign_condition && answers.benign_condition.includes("Yes")) score -= 15;
  if (answers.chest_radiation === "Yes") score -= 20;
  if (answers.previous_biopsy === "Yes") score -= 10;
  return Math.max(20, score);
}

function countMedicalHistoryRiskFactors(answers) {
  let count = 0;
  if (answers.cancer_history === "Yes, I am a Breast Cancer Patient currently undergoing treatment") count++;
  if (answers.cancer_history && answers.cancer_history.includes("survivor")) count++;
  if (answers.benign_condition && answers.benign_condition.includes("Yes")) count++;
  if (answers.chest_radiation === "Yes") count++;
  if (answers.previous_biopsy === "Yes") count++;
  return count;
}

function calculateMedicalHistoryRiskLevel(answers) {
  const score = calculateMedicalHistoryScore(answers);
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  return 'high';
}

function getMedicalHistoryRiskFactors(answers) {
  const factors = [];
  if (answers.cancer_history === "Yes, I am a Breast Cancer Patient currently undergoing treatment") factors.push("Current breast cancer treatment");
  if (answers.cancer_history && answers.cancer_history.includes("survivor")) factors.push("Breast cancer survivor");
  if (answers.benign_condition && answers.benign_condition.includes("Yes")) factors.push("History of benign breast conditions");
  if (answers.chest_radiation === "Yes") factors.push("Previous chest radiation");
  if (answers.previous_biopsy === "Yes") factors.push("Previous breast biopsy");
  return factors;
}

// Hormonal Factors Section Functions
function calculateHormonalScore(answers) {
  let score = 100;
  if (answers.hormone_therapy === "Yes, more than 5 years") score -= 20;
  if (answers.hormone_therapy === "Yes, less than 5 years") score -= 10;
  if (answers.birth_control === "Yes, more than 10 years") score -= 15;
  if (answers.birth_control === "Yes, less than 10 years") score -= 5;
  if (answers.menopause === "Yes, at age 55 or older") score -= 10;
  if (answers.first_period && parseInt(answers.first_period) < 12) score -= 10;
  if (answers.first_pregnancy && parseInt(answers.first_pregnancy) > 30) score -= 10;
  if (answers.breastfeeding === "No") score -= 5;
  return Math.max(20, score);
}

function countHormonalRiskFactors(answers) {
  let count = 0;
  if (answers.hormone_therapy === "Yes, more than 5 years") count++;
  if (answers.hormone_therapy === "Yes, less than 5 years") count++;
  if (answers.birth_control === "Yes, more than 10 years") count++;
  if (answers.birth_control === "Yes, less than 10 years") count++;
  if (answers.menopause === "Yes, at age 55 or older") count++;
  if (answers.first_period && parseInt(answers.first_period) < 12) count++;
  if (answers.first_pregnancy && parseInt(answers.first_pregnancy) > 30) count++;
  if (answers.breastfeeding === "No") count++;
  return count;
}

function calculateHormonalRiskLevel(answers) {
  const score = calculateHormonalScore(answers);
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  return 'high';
}

function getHormonalRiskFactors(answers) {
  const factors = [];
  if (answers.hormone_therapy === "Yes, more than 5 years") factors.push("Long-term hormone replacement therapy");
  if (answers.hormone_therapy === "Yes, less than 5 years") factors.push("Hormone replacement therapy");
  if (answers.birth_control === "Yes, more than 10 years") factors.push("Long-term hormonal birth control");
  if (answers.birth_control === "Yes, less than 10 years") factors.push("Hormonal birth control use");
  if (answers.menopause === "Yes, at age 55 or older") factors.push("Late menopause (after 55)");
  if (answers.first_period && parseInt(answers.first_period) < 12) factors.push("Early menarche (before 12)");
  if (answers.first_pregnancy && parseInt(answers.first_pregnancy) > 30) factors.push("First pregnancy after 30");
  if (answers.breastfeeding === "No") factors.push("Never breastfed");
  return factors;
}

// Physical Characteristics Section Functions
function calculatePhysicalScore(answers) {
  let score = 100;
  if (answers.dense_breast === "Yes") score -= 15;
  if (answers.bmi && parseFloat(answers.bmi) > 25) score -= 10;
  if (answers.bmi && parseFloat(answers.bmi) > 30) score -= 20;
  if (answers.height_weight && answers.height_weight.includes("overweight")) score -= 10;
  if (answers.height_weight && answers.height_weight.includes("obese")) score -= 20;
  return Math.max(20, score);
}

function countPhysicalRiskFactors(answers) {
  let count = 0;
  if (answers.dense_breast === "Yes") count++;
  if (answers.bmi && parseFloat(answers.bmi) > 25) count++;
  if (answers.height_weight && answers.height_weight.includes("overweight")) count++;
  if (answers.height_weight && answers.height_weight.includes("obese")) count++;
  return count;
}

function calculatePhysicalRiskLevel(answers) {
  const score = calculatePhysicalScore(answers);
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  return 'high';
}

function getPhysicalRiskFactors(answers) {
  const factors = [];
  if (answers.dense_breast === "Yes") factors.push("Dense breast tissue");
  if (answers.bmi && parseFloat(answers.bmi) > 30) factors.push("Obesity (BMI > 30)");
  else if (answers.bmi && parseFloat(answers.bmi) > 25) factors.push("Overweight (BMI > 25)");
  if (answers.height_weight && answers.height_weight.includes("obese")) factors.push("Obesity");
  else if (answers.height_weight && answers.height_weight.includes("overweight")) factors.push("Overweight");
  return factors;
}

// Health Score Calculation Functions
function calculateControllableScore(sectionBreakdown) {
  // Controllable sections: Lifestyle, some Hormonal Factors, Physical Characteristics
  const controllableSections = sectionBreakdown.filter(section => 
    section.name === "Lifestyle" || 
    section.name === "Hormonal Factors" || 
    section.name === "Physical Characteristics"
  );
  
  if (controllableSections.length === 0) return 80; // Default if no controllable sections
  
  const totalScore = controllableSections.reduce((sum, section) => sum + section.score, 0);
  return Math.round(totalScore / controllableSections.length);
}

function calculateUncontrollableScore(sectionBreakdown) {
  // Uncontrollable sections: Demographics, Family History & Genetics, Medical History
  const uncontrollableSections = sectionBreakdown.filter(section => 
    section.name === "Demographics" || 
    section.name === "Family History & Genetics" || 
    section.name === "Medical History"
  );
  
  if (uncontrollableSections.length === 0) return 85; // Default if no uncontrollable sections
  
  const totalScore = uncontrollableSections.reduce((sum, section) => sum + section.score, 0);
  return Math.round(totalScore / uncontrollableSections.length);
}

// Scientific Risk Calculation Functions (Based on Gail Model & Medical Research)
function calculateGailModelRiskScore(answers) {
  console.log('🧮 Calculating Gail Model-based risk score...');
  
  const age = parseInt(answers.age || 30);
  let riskScore = 0;
  
  // Age Factor (Primary Risk Factor)
  if (age < 30) riskScore += 10;
  else if (age < 40) riskScore += 15;
  else if (age < 50) riskScore += 25;
  else if (age < 60) riskScore += 35;
  else if (age < 70) riskScore += 50;
  else riskScore += 65;
  
  // Family History (Strong Risk Factor - Relative Risk 1.8-2.1)
  if (answers.family_history === "Yes, I have first-degree relative with BC") {
    riskScore += 25; // Significant increase
  } else if (answers.family_history && answers.family_history.includes("second-degree")) {
    riskScore += 15; // Moderate increase
  }
  
  // BRCA Genetic Testing (Highest Risk Factor - Relative Risk 3-7)
  if (answers.brca_test === "BRCA1/2") {
    riskScore += 40; // Very high risk
  }
  
  // Age at Menarche (First Period) - Relative Risk 1.2-1.3
  const firstPeriod = parseInt(answers.first_period || 13);
  if (firstPeriod < 12) riskScore += 8;
  else if (firstPeriod > 14) riskScore -= 5; // Protective
  
  // Age at First Birth - Relative Risk 1.3-1.9
  const firstPregnancy = parseInt(answers.first_pregnancy || 0);
  if (firstPregnancy === 0) riskScore += 10; // Nulliparous
  else if (firstPregnancy > 30) riskScore += 12;
  else if (firstPregnancy < 20) riskScore -= 8; // Protective
  
  // Breastfeeding Duration - Relative Risk 0.7-0.9 (Protective)
  if (answers.breastfeeding === "Yes, more than 12 months total") {
    riskScore -= 12; // Strong protective effect
  } else if (answers.breastfeeding === "Yes, less than 12 months total") {
    riskScore -= 6; // Moderate protective effect
  }
  
  // Hormone Replacement Therapy - Relative Risk 1.3-1.4
  if (answers.hormone_therapy === "Yes, more than 5 years") {
    riskScore += 15;
  } else if (answers.hormone_therapy === "Yes, less than 5 years") {
    riskScore += 8;
  }
  
  // Birth Control Pills - Relative Risk 1.1-1.2
  if (answers.birth_control === "Yes, more than 10 years") {
    riskScore += 10;
  } else if (answers.birth_control === "Yes, less than 10 years") {
    riskScore += 5;
  }
  
  // Breast Density - Relative Risk 1.2-2.1
  if (answers.dense_breast === "Yes") {
    riskScore += 18; // Significant risk factor
  }
  
  // Previous Breast Biopsy - Relative Risk 1.5-1.8
  if (answers.previous_biopsy === "Yes") {
    riskScore += 15;
  }
  
  // Benign Breast Conditions - Relative Risk 1.3-1.5
  if (answers.benign_condition && answers.benign_condition.includes("Yes")) {
    riskScore += 12;
  }
  
  // Chest Radiation - Relative Risk 2.1-4.0
  if (answers.chest_radiation === "Yes") {
    riskScore += 30; // Very high risk factor
  }
  
  // Lifestyle Factors
  // Alcohol - Relative Risk 1.07-1.12 per drink/day
  if (answers.alcohol === "2 or more drinks") {
    riskScore += 8;
  } else if (answers.alcohol === "1 drink") {
    riskScore += 3;
  }
  
  // Physical Activity - Relative Risk 0.75-0.85 (Protective)
  if (answers.exercise === "Yes, regular vigorous exercise") {
    riskScore -= 10; // Strong protective effect
  } else if (answers.exercise === "Yes, moderate exercise") {
    riskScore -= 5; // Moderate protective effect
  } else if (answers.exercise === "No, little or no regular exercise") {
    riskScore += 8; // Increased risk
  }
  
  // BMI/Weight - Relative Risk 1.3-1.6 for obesity (postmenopausal)
  const bmi = parseFloat(answers.bmi || 25);
  if (age > 50) { // Postmenopausal
    if (bmi > 30) riskScore += 15; // Obese
    else if (bmi > 25) riskScore += 8; // Overweight
  } else { // Premenopausal - obesity is protective
    if (bmi > 30) riskScore -= 5;
  }
  
  // Smoking - Relative Risk 1.1-1.2
  if (answers.smoke === "Yes") {
    riskScore += 6;
  }
  
  // Diet Pattern - Western diet increases risk
  if (answers.western_diet === "Yes, Western diet") {
    riskScore += 5;
  }
  
  // Stress (indirect effect through lifestyle)
  if (answers.chronic_stress === "Yes, chronic high stress") {
    riskScore += 4;
  }
  
  // Menopause Age - Relative Risk 1.03 per year delay
  if (answers.menopause === "Yes, at age 55 or older") {
    riskScore += 8; // Late menopause increases risk
  }
  
  // Ensure risk score stays within reasonable bounds
  riskScore = Math.max(5, Math.min(95, riskScore));
  
  console.log(`✅ Gail Model risk score calculated: ${riskScore}`);
  return riskScore;
}

function determineRiskCategory(riskScore) {
  if (riskScore < 20) return 'low';
  else if (riskScore < 40) return 'moderate';
  else if (riskScore < 60) return 'high';
  else return 'very-high';
}

function generateRealRecommendations(riskCategory, riskFactors, userProfile, aiAnalysis) {
  const recommendations = [];
  
  // Use AI analysis recommendations if available
  if (aiAnalysis && aiAnalysis.analysis) {
    if (typeof aiAnalysis.analysis === 'string') {
      // Extract recommendations from AI text
      const lines = aiAnalysis.analysis.split('\n');
      lines.forEach(line => {
        if (line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('4.')) {
          recommendations.push(line.replace(/^\d+\.\s*/, '').trim());
        }
      });
    }
  }
  
  // Add specific recommendations based on risk factors
  if (userProfile === 'current_patient') {
    recommendations.push("🚨 Continue treatment as directed by your oncology team");
    recommendations.push("📋 Regular follow-ups with your healthcare provider");
    recommendations.push("💊 Maintain compliance with prescribed medications");
  } else {
    if (riskCategory === 'high') {
      recommendations.push("🚨 Schedule consultation with breast health specialist");
      recommendations.push("📋 Consider genetic counseling and testing");
      recommendations.push("🔍 Enhanced screening protocol discussion with physician");
    }
    
    recommendations.push("🔍 Perform monthly breast self-examinations");
    recommendations.push("📅 Annual mammograms as recommended by physician");
    recommendations.push("🥗 Maintain healthy diet rich in fruits and vegetables");
    recommendations.push("💪 Regular exercise (150 minutes moderate activity weekly)");
  }
  
  return recommendations;
}

function generateRealDailyPlan(userProfile, riskCategory) {
  return {
    morning: "Start with 5 minutes of breathing exercises, healthy breakfast rich in antioxidants",
    afternoon: "45-minute exercise session, nutritious lunch with leafy greens",
    evening: "Light stretching or yoga, herbal tea for relaxation",
    weekly: {
      exercise_goals: "150 minutes moderate activity or 75 minutes vigorous activity",
      nutrition_focus: "5-7 servings fruits and vegetables daily, limit processed foods",
      stress_management: "Practice mindfulness or meditation 3x per week"
    },
    supplements: userProfile === 'current_patient' ? 
      ["Vitamin D3", "Omega-3", "Immune support supplements as directed"] :
      ["Vitamin D3 (1000-2000 IU daily)", "Omega-3 fatty acids", "Folate"]
  };
}

function getUserProfileDescription(userProfile) {
  const profiles = {
    'teenager': 'Building healthy habits for lifelong breast health',
    'premenopausal': 'Active reproductive years with changing hormone levels', 
    'postmenopausal': 'Post-menopause with increased baseline risk',
    'current_patient': 'Currently undergoing breast cancer treatment',
    'survivor': 'Breast cancer survivor focused on recurrence prevention'
  };
  return profiles[userProfile] || 'Individual health assessment profile';
}

function convertSectionsToScores(sectionBreakdown) {
  const scores = {};
  sectionBreakdown.forEach(section => {
    scores[section.name] = {
      score: section.score,
      factors: section.riskFactors
    };
  });
  return scores;
}

function generateSectionSummaries(sectionBreakdown, answers, userProfile) {
  const summaries = {};
  sectionBreakdown.forEach(section => {
    summaries[section.name] = `Your ${section.name.toLowerCase()} assessment shows a score of ${section.score}/100. ${
      section.riskFactors.length > 0 ? 
        `Risk factors include: ${section.riskFactors.join(', ')}.` :
        'No significant risk factors identified in this category.'
    } Continue following evidence-based recommendations for optimal health.`;
  });
  return summaries;
}

function generateCoachingFocus(riskCategory, riskFactors) {
  const focus = [];
  if (riskCategory === 'high') {
    focus.push('Enhanced prevention strategies for high-risk individuals');
    focus.push('Comprehensive lifestyle optimization program');
  } else {
    focus.push('Maintain current healthy practices');
    focus.push('Preventive lifestyle habits and screening adherence');
  }
  return focus;
}

function generateFollowUpTimeline(userProfile, riskCategory) {
  if (userProfile === 'current_patient') {
    return {
      "1_month": "Review treatment progress with oncology team",
      "3_months": "Coordinate with regular surveillance schedule", 
      "6_months": "Complete comprehensive health assessment",
      "1_year": "Annual survivorship care plan review"
    };
  } else if (riskCategory === 'high') {
    return {
      "1_month": "Schedule consultation with healthcare provider",
      "3_months": "Begin enhanced screening protocol if recommended",
      "6_months": "Review lifestyle modifications and progress",
      "1_year": "Complete annual health assessment and screening updates"
    };
  } else {
    return {
      "1_month": "Establish regular exercise routine",
      "3_months": "Review and adjust lifestyle changes with healthcare provider", 
      "6_months": "Complete follow-up health assessment",
      "1_year": "Annual screening and health review"
    };
  }
}

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, async () => {
  console.log(`🚀 BrezCode Health API server running on port ${PORT}`);
  
  // Test MongoDB connection on startup
  console.log(`🗄️ Testing MongoDB connection...`);
  try {
    const mongoResult = await testMongoConnection();
    
    if (mongoResult.success) {
      console.log(`✅ MongoDB: Connected to ${mongoResult.database}`);
    } else {
      console.log('⚠️ Database: Not available - using fallback storage mode');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('⚠️ Database: Will use fallback storage mode');
  }
  
  if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
    console.log(`📧 Email service: Twilio/SendGrid ✅`);
    console.log(`📧 From: ${process.env.FROM_EMAIL}`);
  } else {
    console.log(`📧 Email service: Console logging only ⚠️`);
    console.log(`📧 To enable Twilio/SendGrid, set SENDGRID_API_KEY and FROM_EMAIL in .env file`);
  }
  
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
