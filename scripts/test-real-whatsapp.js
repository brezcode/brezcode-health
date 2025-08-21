#!/usr/bin/env node

import dotenv from 'dotenv';
import TwilioWhatsAppService from '../services/twilio-whatsapp.js';

// Load environment variables
dotenv.config();

console.log('📱 Testing Real WhatsApp Messages...\n');

// Check if Twilio is configured
if (!TwilioWhatsAppService.isConfigured()) {
  console.log('❌ Twilio not configured. Please check your .env file.');
  process.exit(1);
}

console.log('✅ Twilio configuration loaded successfully!');
console.log(`   - From Number: ${process.env.TWILIO_WHATSAPP_FROM}\n`);

// Test sending real WhatsApp messages
async function testRealWhatsApp() {
  try {
    // Get test phone number from user
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('📱 Enter a phone number to test WhatsApp (include country code):');
    console.log('   Example: +1234567890');
    console.log('   Note: This number must have WhatsApp installed\n');

    rl.question('Phone number: ', async (phoneNumber) => {
      try {
        console.log(`\n🚀 Testing WhatsApp messages to: ${phoneNumber}\n`);

        // Test 1: Send verification code
        console.log('1️⃣ Sending verification code...');
        const verificationResult = await TwilioWhatsAppService.sendVerificationCode(phoneNumber, '123456');
        console.log('   ✅ Verification code sent successfully!');
        console.log(`   - Message SID: ${verificationResult.sid}`);
        console.log(`   - Status: ${verificationResult.status}\n`);

        // Wait a moment before sending next message
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 2: Send health reminder
        console.log('2️⃣ Sending health reminder...');
        const reminderResult = await TwilioWhatsAppService.sendHealthReminder(phoneNumber, 'Time for your daily health check! Remember to stay hydrated and take a short walk.');
        console.log('   ✅ Health reminder sent successfully!');
        console.log(`   - Message SID: ${reminderResult.sid}`);
        console.log(`   - Status: ${reminderResult.status}\n`);

        // Wait a moment before sending next message
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 3: Send health report
        console.log('3️⃣ Sending health report...');
        const reportResult = await TwilioWhatsAppService.sendHealthReport(phoneNumber, 'Your weekly health score: 85/100\n\nGreat job this week! You\'ve been consistent with your exercise routine and healthy eating habits.');
        console.log('   ✅ Health report sent successfully!');
        console.log(`   - Message SID: ${reportResult.sid}`);
        console.log(`   - Status: ${reportResult.status}\n`);

        console.log('🎉 All WhatsApp tests completed successfully!');
        console.log(`📱 Check your WhatsApp at: ${phoneNumber}`);
        console.log('\n💡 What you should see:');
        console.log('   - 3 WhatsApp messages from your business number');
        console.log('   - Professional formatting with emojis');
        console.log('   - Instant delivery to the recipient');

        rl.close();
        
      } catch (error) {
        console.log('❌ WhatsApp test failed:');
        console.log(`   - Error: ${error.message}`);
        
        if (error.message.includes('API Error')) {
          console.log('\n💡 Common issues:');
          console.log('   - Phone number format incorrect (use +1234567890)');
          console.log('   - Number doesn\'t have WhatsApp installed');
          console.log('   - Twilio account needs verification');
          console.log('   - WhatsApp number not properly configured');
        }
        
        rl.close();
        process.exit(1);
      }
    });

  } catch (error) {
    console.log('❌ Test setup failed:');
    console.log(`   - Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testRealWhatsApp();
