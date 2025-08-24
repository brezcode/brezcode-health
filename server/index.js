import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';

// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Session configuration for business dashboard
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

// Import avatar routes
import avatarRoutes from '../backend/routes/avatarRoutes.js';

// Import business routes
import businessAuthRoutes from '../backend/routes/businessAuthRoutes.js';
import businessDashboardRoutes from '../backend/routes/businessDashboardRoutes.js';
import trainingRoutes from '../backend/routes/trainingRoutes.js';

// Import AI training services for REAL AI
import { AvatarTrainingSessionService } from '../backend/services/avatarTrainingSessionService.js';

// In-memory storage for demo (replace with database in production)
let pendingUsers = {};
let verificationCodes = {};
let users = {};

// WhatsApp webhook verification token
const WHATSAPP_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'brezcode-health-2024';

// WhatsApp API configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

// REAL AI TRAINING ENDPOINTS - Direct API (COPIED FROM ARCHIVE)
// These endpoints use REAL Claude/OpenAI for AI-to-AI conversations

// Start AI training session with REAL AI
app.post('/direct-api/training/start', async (req, res) => {
  try {
    const { avatarId = 'dr_sakura', customerId = 'patient', scenario = 'health_consultation' } = req.body;

    console.log(`🚀 DIRECT: Starting AI training session with ${avatarId} for ${scenario}`);

    // Create session using REAL AvatarTrainingSessionService
    const scenarioDetails = {
      id: scenario,
      name: scenario === 'health_consultation' ? 'Breast Health Consultation' : 'Health Scenario',
      description: 'Patient consultation about breast health concerns',
      customerPersona: 'Maria Santos - Health Concerns - Anxious about family history, wants concrete guidance',
      customerMood: 'anxious',
      objectives: ['Provide reassurance', 'Give medical guidance', 'Educate on self-care']
    };

    const session = await AvatarTrainingSessionService.createSession(
      1, // userId
      avatarId,
      scenario,
      'health_coaching',
      scenarioDetails
    );

    console.log(`✅ DIRECT: Training session created: ${session.sessionId}`);

    res.json({
      id: session.sessionId,
      avatar_id: avatarId,
      customer_id: customerId,
      scenario: scenario,
      status: 'running',
      messages: [],
      performance_metrics: {
        response_quality: 90,
        customer_satisfaction: 88,
        goal_achievement: 85,
        conversation_flow: 92
      },
      started_at: session.startedAt.toISOString(),
      duration: 0
    });
  } catch (error) {
    console.error('❌ DIRECT: Error starting training session:', error);
    res.status(500).json({ error: 'Failed to start training session: ' + error.message });
  }
});

// Continue AI training with REAL AI conversation
app.post('/direct-api/training/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log(`🔄 DIRECT: Continuing AI conversation for session ${sessionId}`);

    // Get session to verify it exists
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Continue the conversation with AI-generated patient question and Dr. Sakura response using REAL AI
    const updatedSession = await AvatarTrainingSessionService.continueConversation(sessionId);

    console.log(`✅ DIRECT: AI Continue processed successfully for session ${sessionId}`);

    // Format response to match frontend expectations
    const formattedMessages = updatedSession.conversationHistory.map(msg => ({
      id: msg.messageId || `msg_${msg.sequenceNumber}`,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || new Date().toISOString(),
      emotion: msg.emotion || 'neutral',
      quality_score: msg.role === 'avatar' ? 90 : undefined
    }));

    res.json({
      success: true,
      session: {
        id: sessionId,
        status: 'running',
        messages: formattedMessages,
        performance_metrics: {
          response_quality: Math.floor(Math.random() * 10) + 85,
          customer_satisfaction: Math.floor(Math.random() * 10) + 80,
          goal_achievement: Math.floor(Math.random() * 10) + 75,
          conversation_flow: Math.floor(Math.random() * 10) + 85
        }
      }
    });
  } catch (error) {
    console.error('❌ DIRECT: AI Continue error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop AI training session
app.post('/direct-api/training/:sessionId/stop', async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log(`🛑 DIRECT: Stopping training session ${sessionId}`);

    // Complete the session
    await AvatarTrainingSessionService.completeSession(sessionId);

    const finalSession = {
      id: sessionId,
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 180,
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 15) + 80,
        customer_satisfaction: Math.floor(Math.random() * 15) + 75, 
        goal_achievement: Math.floor(Math.random() * 20) + 70,
        conversation_flow: Math.floor(Math.random() * 15) + 80
      },
      messages: []
    };

    console.log(`✅ DIRECT: Training session completed: ${sessionId}`);

    res.json(finalSession);
  } catch (error) {
    console.error('❌ DIRECT: Error stopping training:', error);
    res.status(500).json({ error: 'Failed to stop training: ' + error.message });
  }
});

// API Routes

// Dr. Sakura Avatar routes
app.use('/api/avatar', avatarRoutes);

// Business Dashboard Authentication routes
app.use('/api/business/auth', businessAuthRoutes);

// Business Dashboard API routes
app.use('/api/business/dashboard', businessDashboardRoutes);

// AI Training routes
app.use('/api/brezcode/ai-training', trainingRoutes);

// Serve business dashboard static files
app.use('/backend/static', express.static(path.join(__dirname, '../backend/public')));

// Business dashboard routes
app.get('/backend', (req, res) => {
  res.sendFile(path.join(__dirname, '../backend/public/login.html'));
});

app.get('/backend/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../backend/public/dashboard.html'));
});

app.get('/backend/training', (req, res) => {
  res.sendFile(path.join(__dirname, '../backend/public/training.html'));
});

app.get('/backend/training-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../backend/public/training-test.html'));
});

// WhatsApp signup endpoint
app.post('/api/auth/signup-whatsapp', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, password, quizAnswers } = req.body;
    
    if (!firstName || !lastName || !phoneNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    if (users[phoneNumber]) {
      return res.status(409).json({ error: 'Account with this phone number already exists' });
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Store pending user data
    pendingUsers[phoneNumber] = {
      firstName,
      lastName,
      phoneNumber,
      password,
      quizAnswers: quizAnswers || {},
      createdAt: new Date()
    };
    
    // Store verification code
    verificationCodes[phoneNumber] = {
      code: verificationCode,
      expiryTime,
      attempts: 0
    };
    
    // Send WhatsApp verification message
    const whatsappSent = await sendWhatsAppVerification(phoneNumber, verificationCode);
    
    res.json({
      message: 'Account created successfully. Please check your WhatsApp for verification code.',
      requiresVerification: true,
      phoneNumber: phoneNumber,
      whatsappSent: whatsappSent
    });
    
  } catch (error) {
    console.error('WhatsApp signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, quizAnswers } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    if (users[email]) {
      return res.status(409).json({ error: 'Account with this email already exists' });
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Store pending user data
    pendingUsers[email] = {
      firstName,
      lastName,
      email,
      password,
      quizAnswers: quizAnswers || {},
      createdAt: new Date()
    };
    
    // Store verification code
    verificationCodes[email] = {
      code: verificationCode,
      expiryTime,
      attempts: 0
    };
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    res.json({
      message: 'Account created successfully. Please check your email for verification code.',
      requiresVerification: true,
      email: email,
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Verify WhatsApp endpoint
app.post('/api/auth/verify-whatsapp', (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    
    console.log('🔍 WHATSAPP VERIFICATION DEBUG:');
    console.log('📱 Phone number received:', phoneNumber);
    console.log('🔢 Code received:', code);
    console.log('📋 Current verification codes in memory:', JSON.stringify(verificationCodes, null, 2));
    console.log('👥 Current pending users:', Object.keys(pendingUsers));
    
    if (!phoneNumber || !code) {
      console.log('❌ Missing phone number or code');
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }
    
    // Check if verification code exists and is valid
    const verification = verificationCodes[phoneNumber];
    if (!verification) {
      return res.status(400).json({ error: 'No verification code found for this phone number' });
    }
    
    // Check if code has expired
    if (new Date() > verification.expiryTime) {
      delete verificationCodes[phoneNumber];
      return res.status(400).json({ error: 'Verification code has expired' });
    }
    
    // Check if code matches
    if (verification.code !== code) {
      verification.attempts += 1;
      if (verification.attempts >= 5) {
        delete verificationCodes[phoneNumber];
        return res.status(400).json({ error: 'Too many failed attempts. Please request a new code.' });
      }
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Get pending user data
    const pendingUser = pendingUsers[phoneNumber];
    if (!pendingUser) {
      return res.status(400).json({ error: 'No pending account found for this phone number' });
    }
    
    // Create verified user (remove password from response)
    const { password, ...userWithoutPassword } = pendingUser;
    const verifiedUser = {
      ...userWithoutPassword,
      id: Date.now(),
      isPhoneVerified: true,
      verifiedAt: new Date()
    };
    
    // Store verified user
    users[phoneNumber] = { ...verifiedUser, password }; // Keep password in storage
    
    // Clean up temporary data
    delete pendingUsers[phoneNumber];
    delete verificationCodes[phoneNumber];
    
    console.log(`✅ Phone number verified successfully for: ${phoneNumber}`);
    
    res.json({
      message: 'Phone number verified successfully',
      user: userWithoutPassword // Don't send password to client
    });
    
  } catch (error) {
    console.error('WhatsApp verification error:', error);
    res.status(500).json({ error: 'Failed to verify phone number' });
  }
});

// Verify email endpoint
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, code } = req.body;
    
    console.log('🔍 VERIFICATION DEBUG:');
    console.log('📧 Email received:', email);
    console.log('🔢 Code received:', code);
    console.log('📋 Current verification codes in memory:', JSON.stringify(verificationCodes, null, 2));
    console.log('👥 Current pending users:', Object.keys(pendingUsers));
    
    if (!email || !code) {
      console.log('❌ Missing email or code');
      return res.status(400).json({ error: 'Email and verification code are required' });
    }
    
    // Check if verification code exists and is valid
    const verification = verificationCodes[email];
    if (!verification) {
      return res.status(400).json({ error: 'No verification code found for this email' });
    }
    
    // Check if code has expired
    if (new Date() > verification.expiryTime) {
      delete verificationCodes[email];
      return res.status(400).json({ error: 'Verification code has expired' });
    }
    
    // Check if code matches
    if (verification.code !== code) {
      verification.attempts += 1;
      if (verification.attempts >= 5) {
        delete verificationCodes[email];
        return res.status(400).json({ error: 'Too many failed attempts. Please request a new code.' });
      }
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Get pending user data
    const pendingUser = pendingUsers[email];
    if (!pendingUser) {
      return res.status(400).json({ error: 'No pending account found for this email' });
    }
    
    // Create verified user (remove password from response)
    const { password, ...userWithoutPassword } = pendingUser;
    const verifiedUser = {
      ...userWithoutPassword,
      id: Date.now(),
      isEmailVerified: true,
      verifiedAt: new Date()
    };
    
    // Store verified user
    users[email] = { ...verifiedUser, password }; // Keep password in storage
    
    // Clean up temporary data
    delete pendingUsers[email];
    delete verificationCodes[email];
    
    console.log(`✅ Email verified successfully for: ${email}`);
    
    res.json({
      message: 'Email verified successfully',
      user: userWithoutPassword // Don't send password to client
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Resend WhatsApp verification code endpoint
app.post('/api/auth/resend-whatsapp-verification', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Check if pending user exists
    const pendingUser = pendingUsers[phoneNumber];
    if (!pendingUser) {
      return res.status(400).json({ error: 'No pending verification found for this phone number' });
    }
    
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    
    // Update verification code
    verificationCodes[phoneNumber] = {
      code: verificationCode,
      expiryTime,
      attempts: 0
    };
    
    // Send new WhatsApp verification message
    const whatsappSent = await sendWhatsAppVerification(phoneNumber, verificationCode);
    
    res.json({
      message: 'Verification code resent successfully',
      whatsappSent: whatsappSent
    });
    
  } catch (error) {
    console.error('Resend WhatsApp verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// Resend verification code endpoint
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if pending user exists
    const pendingUser = pendingUsers[email];
    if (!pendingUser) {
      return res.status(400).json({ error: 'No pending verification found for this email' });
    }
    
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    
    // Update verification code
    verificationCodes[email] = {
      code: verificationCode,
      expiryTime,
      attempts: 0
    };
    
    // Send new verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    res.json({
      message: 'Verification code resent successfully',
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BrezCode Health API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get user stats (for demo)
app.get('/api/stats', (req, res) => {
  res.json({
    totalUsers: Object.keys(users).length,
    pendingVerifications: Object.keys(pendingUsers).length,
    activeVerificationCodes: Object.keys(verificationCodes).length
  });
});

// WhatsApp Webhook Endpoints
app.get('/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ WhatsApp webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ WhatsApp webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

app.post('/webhook/whatsapp', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    try {
      body.entry.forEach(entry => {
        entry.changes.forEach(change => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            if (messages) {
              messages.forEach(message => {
                console.log('📱 Received WhatsApp message:', {
                  from: message.from,
                  timestamp: message.timestamp,
                  type: message.type,
                  text: message.text?.body || 'No text content'
                });
                
                // Handle different message types
                if (message.type === 'text') {
                  // Process text message
                  console.log(`💬 User ${message.from} said: ${message.text.body}`);
                  
                  // Here you can add your message handling logic
                  // For example, auto-replies, health tips, etc.
                }
              });
            }
          }
        });
      });
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Error processing WhatsApp webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(404).send('Not Found');
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 BrezCode Health API server running on port ${PORT}`);
  
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