#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Complete Email Verification Flow...\n');

// Check environment variables
if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
  console.log('❌ Missing SendGrid configuration. Run "npm run setup-secrets" first.');
  process.exit(1);
}

// Generate verification code (same logic as your server)
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Test email verification process
async function testVerificationFlow() {
  try {
    const { default: sgMail } = await import('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Generate test verification code
    const verificationCode = generateVerificationCode();
    const testEmail = process.env.FROM_EMAIL;
    
    console.log('🔐 Generated verification code:', verificationCode);
    console.log('📧 Sending verification email to:', testEmail);
    
    // Create verification email (same template as your server)
    const msg = {
      to: testEmail,
      from: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME || 'BrezCode Health'
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
                ${verificationCode}
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
                This email was sent to ${testEmail}
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // Send the email
    await sgMail.send(msg);
    
    console.log('✅ Verification email sent successfully!');
    console.log('📬 Check your inbox for the verification email');
    console.log('🔐 Verification code:', verificationCode);
    console.log('\n🎯 This simulates exactly what happens when a user signs up!');
    
  } catch (error) {
    console.log('❌ Verification email failed:');
    
    if (error.response) {
      const { body } = error.response;
      console.log(`   - Error: ${body.errors?.[0]?.message || 'Unknown error'}`);
      console.log(`   - Code: ${body.errors?.[0]?.code || 'N/A'}`);
      
      if (body.errors?.[0]?.code === 403) {
        console.log('\n💡 Common solutions:');
        console.log('   - Verify your sender email in SendGrid');
        console.log('   - Check if your API key has proper permissions');
        console.log('   - Ensure your SendGrid account is active');
      }
    } else {
      console.log(`   - Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

// Run the test
testVerificationFlow();

