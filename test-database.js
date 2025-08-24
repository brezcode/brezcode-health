// Quick database integration test
import { testConnection } from './backend/config/database.js';
import QuizResult from './backend/models/QuizResult.js';
import AITrainingSession from './backend/models/AITrainingSession.js';

console.log('🚀 Testing database integration...');

async function testDatabaseIntegration() {
  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const isConnected = await testConnection();
    console.log(`   Database connection: ${isConnected ? '✅ Connected' : '❌ Failed'}`);
    
    if (!isConnected) {
      console.log('❌ Database connection failed. Check your DATABASE_URL and network.');
      return;
    }

    // Test QuizResult operations
    console.log('\n2. Testing QuizResult model...');
    const testQuiz = await QuizResult.create({
      user_id: 'test_user_' + Date.now(),
      answers: { age: 30, smoking: 'No' },
      risk_score: 75,
      risk_level: 'moderate',
      recommendations: ['Take regular self-exams', 'Schedule yearly mammograms']
    });
    console.log('   ✅ QuizResult created:', testQuiz.session_id);

    const retrievedQuiz = await QuizResult.findBySessionId(testQuiz.session_id);
    console.log('   ✅ QuizResult retrieved:', retrievedQuiz ? 'Success' : 'Failed');

    // Test AITrainingSession operations
    console.log('\n3. Testing AITrainingSession model...');
    const testSession = await AITrainingSession.create({
      session_id: 'test_session_' + Date.now(),
      avatar_id: 'dr_sakura',
      customer_id: 'test_customer',
      scenario: 'health_consultation',
      performance_metrics: {
        response_quality: 90,
        customer_satisfaction: 85,
        goal_achievement: 80,
        conversation_flow: 88
      }
    });
    console.log('   ✅ AITrainingSession created:', testSession.session_id);

    const retrievedSession = await AITrainingSession.findBySessionId(testSession.session_id);
    console.log('   ✅ AITrainingSession retrieved:', retrievedSession ? 'Success' : 'Failed');

    // Clean up test data
    console.log('\n4. Cleaning up test data...');
    await QuizResult.delete(testQuiz.session_id);
    await AITrainingSession.delete(testSession.session_id);
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 All database integration tests passed!');
    
  } catch (error) {
    console.error('❌ Database integration test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseIntegration();