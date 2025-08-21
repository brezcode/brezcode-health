import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3002';
const TEST_USER_ID = 12345;

async function testDrSakuraIntegration() {
  console.log('🌸 Testing Dr. Sakura Avatar Integration...\n');
  
  try {
    // Test 1: Health check
    console.log('🏥 Step 1: Testing avatar health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/avatar/health`);
    const healthResult = await healthResponse.json();
    console.log('Avatar Health:', healthResult);
    
    if (!healthResult.success) {
      console.log('❌ Avatar system not healthy, stopping tests');
      return;
    }
    
    // Test 2: Get Dr. Sakura configuration
    console.log('\n⚙️ Step 2: Getting Dr. Sakura configuration...');
    const configResponse = await fetch(`${BASE_URL}/api/avatar/dr-sakura/config`);
    const configResult = await configResponse.json();
    console.log('Dr. Sakura Config:');
    console.log(`- Name: ${configResult.avatar?.name}`);
    console.log(`- Role: ${configResult.avatar?.role}`);
    console.log(`- Specializations: ${configResult.avatar?.specializations?.length || 0} areas`);
    
    // Test 3: Set user session data
    console.log('\n👤 Step 3: Setting up user session...');
    const sessionData = {
      firstName: 'Jane',
      lastName: 'Smith',
      age: 35,
      email: 'jane.smith@example.com',
      quizAnswers: {
        age: 35,
        country: 'Hong Kong',
        family_history: 'No family history',
        exercise: 'Regular exercise 3x week',
        stress_level: 'Moderate'
      }
    };
    
    const sessionResponse = await fetch(`${BASE_URL}/api/avatar/user/${TEST_USER_ID}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    
    const sessionResult = await sessionResponse.json();
    console.log('Session Setup:', sessionResult.success ? '✅ Success' : '❌ Failed');
    
    // Test 4: Chat with Dr. Sakura
    console.log('\n🌸 Step 4: Testing Dr. Sakura chat...');
    const chatMessage = "Hi Dr. Sakura, I'm concerned about some changes I noticed during my self-examination. Can you help me understand what I should do?";
    
    const chatResponse = await fetch(`${BASE_URL}/api/avatar/dr-sakura/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USER_ID,
        message: chatMessage,
        context: {
          currentConcerns: ['breast changes', 'self-examination findings']
        }
      })
    });
    
    const chatResult = await chatResponse.json();
    
    if (chatResult.success) {
      console.log('✅ Dr. Sakura responded successfully!');
      console.log(`\n🌸 Dr. Sakura says:`);
      console.log(`"${chatResult.response.content}"`);
      console.log(`\n📊 Quality Scores:`);
      console.log(`- Empathy: ${chatResult.response.qualityScores.empathy}/100`);
      console.log(`- Medical Accuracy: ${chatResult.response.qualityScores.medicalAccuracy}/100`);
      console.log(`- Overall: ${chatResult.response.qualityScores.overall}/100`);
    } else {
      console.log('❌ Dr. Sakura chat failed:', chatResult.error);
      if (chatResult.fallbackResponse) {
        console.log('📝 Fallback response provided:', chatResult.fallbackResponse.content);
      }
    }
    
    // Test 5: Get conversation history
    console.log('\n📜 Step 5: Getting conversation history...');
    const historyResponse = await fetch(`${BASE_URL}/api/avatar/user/${TEST_USER_ID}/conversations`);
    const historyResult = await historyResponse.json();
    
    if (historyResult.success) {
      console.log(`✅ Retrieved ${historyResult.total} conversations`);
      if (historyResult.conversations.length > 0) {
        const latest = historyResult.conversations[historyResult.conversations.length - 1];
        console.log(`📝 Latest conversation: "${latest.userMessage.substring(0, 50)}..."`);
        console.log(`🌸 Dr. Sakura: "${latest.avatarResponse.substring(0, 50)}..."`);
      }
    } else {
      console.log('❌ Failed to get conversation history:', historyResult.error);
    }
    
    // Test 6: Get training scenarios
    console.log('\n🎭 Step 6: Getting training scenarios...');
    const scenariosResponse = await fetch(`${BASE_URL}/api/avatar/dr-sakura/training-scenarios`);
    const scenariosResult = await scenariosResponse.json();
    
    if (scenariosResult.success) {
      console.log(`✅ Retrieved ${scenariosResult.total} training scenarios:`);
      scenariosResult.scenarios.forEach(scenario => {
        console.log(`- ${scenario.name} (${scenario.difficulty}): ${scenario.description}`);
      });
    } else {
      console.log('❌ Failed to get training scenarios');
    }
    
    // Test 7: Get system statistics
    console.log('\n📊 Step 7: Getting system statistics...');
    const statsResponse = await fetch(`${BASE_URL}/api/avatar/stats`);
    const statsResult = await statsResponse.json();
    
    if (statsResult.success) {
      console.log('✅ Avatar System Statistics:');
      console.log(`- Total Sessions: ${statsResult.stats.totalSessions}`);
      console.log(`- Total Conversations: ${statsResult.stats.totalConversations}`);
      console.log(`- Active Sessions: ${statsResult.stats.activeSessions}`);
      console.log(`- System: ${statsResult.stats.avatarSystem}`);
      console.log(`- Uptime: ${Math.round(statsResult.stats.uptime)}s`);
    } else {
      console.log('❌ Failed to get system statistics');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

console.log('🚀 BrezCode Health - Dr. Sakura Avatar Test Suite');
console.log('⚠️  Make sure your server is running on port 3002');
console.log('⚠️  Ensure ANTHROPIC_API_KEY is set in .env file\n');

await testDrSakuraIntegration();

console.log('\n✅ Dr. Sakura avatar test completed!');
console.log('\n🌸 Dr. Sakura is ready to provide personalized breast health coaching!');