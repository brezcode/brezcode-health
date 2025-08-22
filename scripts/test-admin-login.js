import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const RAILWAY_URL = 'https://brezcode-health-production.up.railway.app';
const LOCAL_URL = 'http://localhost:3002';

async function testAdminLogin(baseUrl) {
  console.log(`🔐 Testing admin login at: ${baseUrl}\n`);
  
  try {
    const loginData = {
      email: 'leedennyps@gmail.com',
      password: '11111111'
    };
    
    console.log('📝 Attempting login with:');
    console.log(`- Email: ${loginData.email}`);
    console.log(`- Password: ${loginData.password}\n`);
    
    // Test login
    const loginResponse = await fetch(`${baseUrl}/api/business/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ Login successful!');
      console.log(`👤 Welcome: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
      console.log(`📧 Email: ${loginResult.user.email}`);
      console.log(`🎯 Role: ${loginResult.user.role}`);
      console.log(`📅 Created: ${new Date(loginResult.user.createdAt).toLocaleString()}\n`);
      
      // Test dashboard access
      console.log('📊 Testing dashboard access...');
      const dashboardResponse = await fetch(`${baseUrl}/backend/dashboard`);
      
      if (dashboardResponse.ok) {
        console.log('✅ Dashboard accessible');
        console.log(`🌐 Dashboard URL: ${baseUrl}/backend/dashboard\n`);
      } else {
        console.log('❌ Dashboard not accessible');
        console.log(`Status: ${dashboardResponse.status}\n`);
      }
      
      return true;
      
    } else {
      console.log('❌ Login failed:');
      console.log(loginResult.error || 'Unknown error');
      console.log(`Status: ${loginResponse.status}\n`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 BrezCode Health - Admin Login Test Suite\n');
  console.log('Testing admin credentials:');
  console.log('Email: leedennyps@gmail.com');
  console.log('Password: 11111111\n');
  console.log('=' * 50 + '\n');
  
  // Test Railway deployment
  console.log('🚂 Testing Railway deployment...');
  const railwaySuccess = await testAdminLogin(RAILWAY_URL);
  
  console.log('=' * 50 + '\n');
  
  // Test local development (if running)
  console.log('🏠 Testing local development server...');
  const localSuccess = await testAdminLogin(LOCAL_URL);
  
  console.log('=' * 50 + '\n');
  
  console.log('📋 Test Summary:');
  console.log(`🚂 Railway: ${railwaySuccess ? '✅ Working' : '❌ Failed'}`);
  console.log(`🏠 Local: ${localSuccess ? '✅ Working' : '❌ Failed'}`);
  
  if (railwaySuccess) {
    console.log('\n🎉 You can access the business dashboard at:');
    console.log(`${RAILWAY_URL}/backend`);
    console.log('\nAlso available at:');
    console.log('https://www.brezcode.com/backend (when DNS is configured)');
  }
  
  console.log('\n🔐 Your login credentials:');
  console.log('Email: leedennyps@gmail.com');
  console.log('Password: 11111111');
}

await runTests();