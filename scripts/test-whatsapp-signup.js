import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3002';
const TEST_PHONE = '+1234567890'; // Replace with your WhatsApp test number

async function testWhatsAppSignup() {
  console.log('🧪 Testing WhatsApp signup and verification flow...\n');
  
  try {
    // Test 1: WhatsApp Signup
    console.log('📱 Step 1: Testing WhatsApp signup...');
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: TEST_PHONE,
      password: 'TestPassword123!',
      quizAnswers: { question1: 'answer1' }
    };
    
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    
    const signupResult = await signupResponse.json();
    console.log('Signup Response:', signupResult);
    
    if (signupResponse.ok) {
      console.log('✅ WhatsApp signup successful');
      
      // Simulate waiting for user to enter verification code
      console.log('\n📝 In a real scenario, user would receive WhatsApp message with verification code');
      console.log('📝 For testing, check your server console for the generated code');
      console.log('📝 Or manually test with the verification endpoint\n');
      
      // Test 2: Health check to make sure server is responding
      console.log('🏥 Step 2: Testing health check...');
      const healthResponse = await fetch(`${BASE_URL}/api/health`);
      const healthResult = await healthResponse.json();
      console.log('Health Check:', healthResult);
      
      // Test 3: Check stats
      console.log('\n📊 Step 3: Checking system stats...');
      const statsResponse = await fetch(`${BASE_URL}/api/stats`);
      const statsResult = await statsResponse.json();
      console.log('System Stats:', statsResult);
      
    } else {
      console.log('❌ WhatsApp signup failed:', signupResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Test WhatsApp message sending directly
async function testWhatsAppMessage() {
  console.log('\n🔧 Testing direct WhatsApp message sending...\n');
  
  try {
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
    
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
      console.log('❌ Missing WhatsApp API credentials in .env file');
      return;
    }
    
    console.log('📱 Attempting to send test message...');
    console.log('Phone Number ID:', META_PHONE_NUMBER_ID);
    console.log('Access Token:', META_ACCESS_TOKEN.substring(0, 20) + '...');
    
    const url = `https://graph.facebook.com/v21.0/${META_PHONE_NUMBER_ID}/messages`;
    
    const message = {
      messaging_product: "whatsapp",
      to: TEST_PHONE,
      type: "text",
      text: {
        body: "🧪 Test message from BrezCode Health API! If you receive this, WhatsApp integration is working correctly."
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ WhatsApp message sent successfully!');
      console.log('Response:', result);
    } else {
      console.log('❌ WhatsApp message failed:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Direct WhatsApp test failed:', error.message);
  }
}

// Run tests
console.log('🚀 BrezCode Health - WhatsApp API Test Suite\n');
console.log('⚠️  Make sure your server is running on port 3002');
console.log('⚠️  Update TEST_PHONE variable with your WhatsApp number\n');

await testWhatsAppSignup();
await testWhatsAppMessage();

console.log('\n✅ Test suite completed!');