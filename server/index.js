import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (replace with database in production)
let pendingUsers = {};
let verificationCodes = {};
let users = {};

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
      
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'BrezCode Health - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">BrezCode Health</h1>
              <p style="color: #6b7280; margin: 5px 0;">Your Personalized Health Journey</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
              <p style="color: #4b5563; margin-bottom: 25px;">Please use the verification code below to complete your account setup:</p>
              
              <div style="background: #2563eb; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
                ${code}
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                This code will expire in 15 minutes.<br>
                If you didn't create a BrezCode Health account, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px;">
                © 2024 BrezCode Health. Taking control of your health, one step at a time.
              </p>
            </div>
          </div>
        `
      };
      
      await sgMail.send(msg);
      console.log(`✅ Verification email sent to ${email}`);
      return true;
    } else {
      console.log('⚠️  SendGrid not configured - check console for code');
      return false;
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
}

// API Routes

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

// Verify email endpoint
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 BrezCode Health API server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.SENDGRID_API_KEY ? 'SendGrid configured ✅' : 'Console logging only ⚠️'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;