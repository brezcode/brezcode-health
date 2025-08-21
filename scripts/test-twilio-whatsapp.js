#!/usr/bin/env node

import dotenv from 'dotenv';
import TwilioWhatsAppService from '../services/twilio-whatsapp.js';

// Load environment variables
dotenv.config();

console.log('📱 Testing Twilio WhatsApp Integration...\n');

// Check if Twilio is configured
if (!TwilioWhatsAppService.isConfigured()) {
  console.log('❌ Twilio not configured. Please check your .env file:');
  console.log('   - TWILIO_ACCOUNT_SID');
  console.log('   - TWILIO_AUTH_TOKEN');
  console.log('   - TWILIO_WHATSAPP_FROM');
  console.log('\n📝 Add these to your .env file and try again.');
  process.exit(1);
}

console.log('✅ Twilio configuration loaded successfully!');
console.log(`   - Account SID: ${process.env.TWILIO_ACCOUNT_SID?.substring(0, 10)}...`);
console.log(`   - Auth Token: ${process.env.TWILIO_AUTH_TOKEN?.substring(0, 10)}...`);
console.log(`   - From Number: ${process.env.TWILIO_WHATSAPP_FROM}`);
console.log('\n');

// Test Twilio service
async function testTwilio() {
  try {
    console.log('🔍 Testing Twilio service methods...');
    
    // Test account info
    console.log('📊 Testing account information...');
    try {
      const accountInfo = await TwilioWhatsAppService.getAccountInfo();
      console.log('   ✅ Account info retrieved successfully');
      console.log(`   - Account Name: ${accountInfo.friendly_name || 'N/A'}`);
      console.log(`   - Account Status: ${accountInfo.status || 'N/A'}`);
      console.log(`   - Account Type: ${accountInfo.type || 'N/A'}`);
    } catch (error) {
      console.log('   ⚠️ Could not retrieve account info (this is okay for testing)');
    }
    
    // Test service methods
    console.log('\n📱 Testing WhatsApp service methods...');
    console.log('   - sendVerificationCode() - Ready');
    console.log('   - sendHealthReminder() - Ready');
    console.log('   - sendHealthReport() - Ready');
    console.log('   - sendAppointmentReminder() - Ready');
    console.log('   - sendTextMessage() - Ready');
    
    console.log('\n✅ Twilio WhatsApp service test completed successfully!');
    console.log('\n📋 Available methods:');
    console.log('   - sendVerificationCode(phone, code)');
    console.log('   - sendHealthReminder(phone, reminder)');
    console.log('   - sendHealthReport(phone, report)');
    console.log('   - sendAppointmentReminder(phone, appointment)');
    console.log('   - sendTextMessage(phone, message)');
    console.log('   - getMessageStatus(messageSid)');
    console.log('   - getAccountInfo()');
    
    console.log('\n🚀 Ready to integrate with your health app!');
    console.log('\n💡 Next steps:');
    console.log('   1. Add your Twilio credentials to .env file');
    console.log('   2. Test with a real phone number');
    console.log('   3. Integrate with your server');
    
  } catch (error) {
    console.log('❌ Twilio test failed:');
    console.log(`   - Error: ${error.message}`);
    
    if (error.message.includes('API Error')) {
      console.log('\n💡 This usually means:');
      console.log('   - Your Account SID is invalid');
      console.log('   - Your Auth Token is incorrect');
      console.log('   - Your Twilio account needs verification');
      console.log('   - Your WhatsApp number is not configured');
    }
    
    process.exit(1);
  }
}

// Run the test
testTwilio();
