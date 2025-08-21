#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing SendGrid Configuration...\n');

// Check if required environment variables are set
const requiredVars = ['SENDGRID_API_KEY', 'FROM_EMAIL', 'FROM_NAME'];
const missingVars = [];

for (const varName of requiredVars) {
  if (!process.env[varName] || process.env[varName].includes('your_')) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('❌ Missing or invalid environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}: ${process.env[varName] || 'NOT SET'}`);
  });
  console.log('\n📝 Please update your .env file with real values and try again.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully:');
console.log(`   - API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
console.log(`   - From Email: ${process.env.FROM_EMAIL}`);
console.log(`   - From Name: ${process.env.FROM_NAME}\n`);

// Test SendGrid API key
async function testSendGrid() {
  try {
    console.log('🔑 Testing SendGrid API key...');
    
    const { default: sgMail } = await import('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    console.log('✅ SendGrid client initialized successfully');
    
    // Test sending a simple email
    console.log('📧 Sending test email...');
    
    const msg = {
      to: process.env.FROM_EMAIL, // Send to yourself for testing
      from: {
        email: process.env.FROM_EMAIL,
        name: process.env.FROM_NAME
      },
      subject: '🧪 SendGrid Test - BrezCode Health',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🎉 SendGrid Test Successful!</h2>
          <p>Your SendGrid configuration is working perfectly!</p>
          <p><strong>From:</strong> ${process.env.FROM_NAME} (${process.env.FROM_EMAIL})</p>
          <p><strong>API Key:</strong> ${process.env.SENDGRID_API_KEY.substring(0, 10)}...</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #64748b; font-size: 14px;">
            This is a test email from your BrezCode Health application.
          </p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
    console.log(`📬 Check your inbox at: ${process.env.FROM_EMAIL}`);
    
  } catch (error) {
    console.log('❌ SendGrid test failed:');
    
    if (error.response) {
      const { body } = error.response;
      console.log(`   - Status: ${body.errors?.[0]?.message || 'Unknown error'}`);
      console.log(`   - Code: ${body.errors?.[0]?.code || 'N/A'}`);
      
      if (body.errors?.[0]?.code === 403) {
        console.log('\n💡 This usually means:');
        console.log('   - Your API key is invalid or expired');
        console.log('   - Your SendGrid account needs verification');
        console.log('   - You need to verify your sender email address');
      }
    } else {
      console.log(`   - Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

// Run the test
testSendGrid();

