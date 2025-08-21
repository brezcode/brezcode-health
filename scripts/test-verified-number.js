import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Your verified virtual number
const VERIFIED_PHONE = '+18482013311';
const RAILWAY_URL = 'https://brezcode-health-production.up.railway.app';

async function testVerifiedNumber() {
  console.log('🧪 Testing WhatsApp with verified virtual number:', VERIFIED_PHONE);
  console.log('📡 Testing against Railway deployment...\n');
  
  try {
    // Test 1: Direct WhatsApp API call
    console.log('📱 Step 1: Testing direct WhatsApp API call...');
    
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
    
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
      console.log('❌ Missing WhatsApp credentials in local .env');
      console.log('   This is expected since we\'re testing the deployed version');
    } else {
      const url = `https://graph.facebook.com/v21.0/${META_PHONE_NUMBER_ID}/messages`;
      
      const message = {
        messaging_product: "whatsapp",
        to: VERIFIED_PHONE,
        type: "text",
        text: {
          body: `🧪 Direct test message to verified number ${VERIFIED_PHONE}. Code: ${Math.floor(100000 + Math.random() * 900000)}`
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
        console.log('✅ Direct WhatsApp API call successful!');
        console.log('📱 Check your WhatsApp for the test message');
        console.log('Response:', result);
      } else {
        console.log('❌ Direct WhatsApp API failed:');
        console.log('Status:', response.status);
        console.log('Error:', result);
      }
    }
    
    console.log('\n📡 Step 2: Testing Railway signup endpoint...');
    
    // Test 2: Railway signup endpoint
    const signupData = {
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: VERIFIED_PHONE,
      password: 'TestPassword123!',
      quizAnswers: { test: 'data' }
    };
    
    const signupResponse = await fetch(`${RAILWAY_URL}/api/auth/signup-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });
    
    const signupResult = await signupResponse.json();
    
    console.log('Railway Signup Response:');
    console.log('Status:', signupResponse.status);
    console.log('Data:', signupResult);
    
    if (signupResult.whatsappSent) {
      console.log('✅ WhatsApp message sent via Railway!');
      console.log('📱 Check your WhatsApp for verification code');
    } else {
      console.log('⚠️  Railway indicates message not sent');
      console.log('   This could be due to:');
      console.log('   - API credentials not properly set on Railway');
      console.log('   - Number still propagating in Meta system');
      console.log('   - Network/API issue');
    }
    
    // Test 3: Check Railway health and stats
    console.log('\n🏥 Step 3: Checking Railway health...');
    const healthResponse = await fetch(`${RAILWAY_URL}/api/health`);
    const healthResult = await healthResponse.json();
    console.log('Health:', healthResult);
    
    const statsResponse = await fetch(`${RAILWAY_URL}/api/stats`);
    const statsResult = await statsResponse.json();
    console.log('Stats:', statsResult);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('🚀 Testing verified virtual number:', VERIFIED_PHONE);
console.log('📡 Railway URL:', RAILWAY_URL);
console.log('=' * 50);

await testVerifiedNumber();

console.log('\n📋 Next Steps:');
console.log('1. Check WhatsApp on', VERIFIED_PHONE, 'for any messages');
console.log('2. If no message received, check Railway logs for errors');
console.log('3. Verify all environment variables are set on Railway dashboard');