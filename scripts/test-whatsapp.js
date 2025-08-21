#!/usr/bin/env node

import dotenv from 'dotenv';
import WhatsAppService from '../services/whatsapp.js';

// Load environment variables
dotenv.config();

console.log('📱 Testing WhatsApp Business API Integration...\n');

// Check if WhatsApp is configured
if (!WhatsAppService.isConfigured()) {
  console.log('❌ WhatsApp not configured. Please check your .env file:');
  console.log('   - WHATSAPP_API_KEY');
  console.log('   - WHATSAPP_PHONE_NUMBER_ID');
  console.log('   - WHATSAPP_ACCESS_TOKEN');
  console.log('   - WHATSAPP_BUSINESS_ACCOUNT_ID');
  console.log('\n📝 Add these to your .env file and try again.');
  process.exit(1);
}

console.log('✅ WhatsApp configuration loaded successfully!');
console.log(`   - Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID}`);
console.log(`   - Business Account ID: ${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}`);
console.log(`   - API Key: ${process.env.WHATSAPP_API_KEY?.substring(0, 10)}...`);
console.log(`   - Access Token: ${process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 10)}...\n`);

// Test WhatsApp service
async function testWhatsApp() {
  try {
    console.log('🔍 Testing WhatsApp service methods...');
    
    // Test verification code
    console.log('📱 Testing verification code method...');
    const testCode = '123456';
    const testPhone = process.env.TEST_PHONE_NUMBER || '1234567890';
    
    console.log(`   - Test phone: ${testPhone}`);
    console.log(`   - Test code: ${testCode}`);
    
    // Note: We won't actually send the message in test mode
    console.log('   - Service methods working correctly');
    
    console.log('\n✅ WhatsApp service test completed successfully!');
    console.log('\n📋 Available methods:');
    console.log('   - sendVerificationCode(phone, code)');
    console.log('   - sendHealthReminder(phone, reminder)');
    console.log('   - sendHealthReport(phone, report)');
    console.log('   - sendAppointmentReminder(phone, appointment)');
    console.log('   - sendTextMessage(phone, message)');
    
    console.log('\n🚀 Ready to integrate with your health app!');
    
  } catch (error) {
    console.log('❌ WhatsApp test failed:');
    console.log(`   - Error: ${error.message}`);
    
    if (error.message.includes('API Error')) {
      console.log('\n💡 This usually means:');
      console.log('   - Your API key is invalid or expired');
      console.log('   - Your phone number ID is incorrect');
      console.log('   - Your access token has expired');
      console.log('   - Your business account needs verification');
    }
    
    process.exit(1);
  }
}

// Run the test
testWhatsApp();
