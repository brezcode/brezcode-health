import { useState } from "react";
import Quiz from "../components/Quiz";
import QuizTransition from "../components/QuizTransition";
import CleanSignupFlow from "../components/CleanSignupFlow";

// Comprehensive risk assessment calculation
function calculateRiskAssessment(answers: Record<string, any>) {
  let riskScore = 100; // Start with perfect health score
  let riskFactors: string[] = [];
  
  // Demographics risk factors
  if (answers.age && answers.age > 50) {
    riskScore -= 15;
    riskFactors.push("Age over 50 increases breast cancer risk");
  }
  if (answers.ethnicity === "Black") {
    riskScore -= 10;
    riskFactors.push("African American women have higher rates of aggressive breast cancers");
  }
  
  // Family History & Genetics
  if (answers.family_history === "Yes") {
    riskScore -= 25;
    riskFactors.push("Family history significantly increases risk");
  }
  if (answers.genetic_mutation === "Yes") {
    riskScore -= 30;
    riskFactors.push("BRCA1/BRCA2 mutations greatly increase risk");
  }
  if (answers.ovarian_cancer === "Yes") {
    riskScore -= 20;
    riskFactors.push("Family history of ovarian cancer increases breast cancer risk");
  }
  
  // Reproductive & Hormonal factors
  if (answers.menarche && answers.menarche < 12) {
    riskScore -= 10;
    riskFactors.push("Early menstruation increases lifetime estrogen exposure");
  }
  if (answers.menopause && answers.menopause > 55) {
    riskScore -= 10;
    riskFactors.push("Late menopause increases estrogen exposure");
  }
  if (answers.hrt === "Yes") {
    riskScore -= 15;
    riskFactors.push("Hormone replacement therapy increases risk");
  }
  if (answers.first_child && answers.first_child > 30) {
    riskScore -= 10;
    riskFactors.push("Having first child after age 30 increases risk");
  }
  
  // Symptoms (immediate attention needed)
  if (answers.breast_symptoms && answers.breast_symptoms !== "No, I don't have any symptoms") {
    riskScore -= 25;
    if (answers.breast_symptoms === "I have a lump in my breast") {
      riskFactors.push("Breast lump detected - requires immediate medical evaluation");
    } else if (answers.breast_symptoms === "I have breast pain") {
      riskFactors.push("Persistent breast pain should be evaluated");
    } else if (answers.breast_symptoms === "I have swollen breast or changed in size or shape") {
      riskFactors.push("Changes in breast size or shape require medical attention");
    }
  }
  
  // Screening gaps
  if (answers.mammogram === "Never" && answers.age > 40) {
    riskScore -= 15;
    riskFactors.push("No mammogram screening after age 40");
  }
  if (answers.self_exam === "Never") {
    riskScore -= 10;
    riskFactors.push("No regular self-examinations");
  }
  
  // Lifestyle factors
  if (answers.bmi && answers.bmi > 25) {
    riskScore -= 10;
    riskFactors.push("BMI above healthy range increases risk");
  }
  if (answers.smoking === "Yes") {
    riskScore -= 15;
    riskFactors.push("Smoking increases breast cancer risk");
  }
  if (answers.alcohol === "Yes") {
    riskScore -= 10;
    riskFactors.push("Regular alcohol consumption increases risk");
  }
  if (answers.exercise === "No, little or no regular exercise") {
    riskScore -= 15;
    riskFactors.push("Sedentary lifestyle increases risk");
  }
  
  // Ensure score doesn't go below 0
  riskScore = Math.max(riskScore, 0);
  
  // Determine risk level based on final score
  let riskLevel: string;
  if (riskScore >= 80) riskLevel = 'low';
  else if (riskScore >= 60) riskLevel = 'moderate';
  else riskLevel = 'high';
  
  // Generate personalized recommendations
  const recommendations = generatePersonalizedRecommendations(riskLevel, riskFactors, answers);
  
  return { riskScore, riskLevel, recommendations, riskFactors };
}

// Generate personalized recommendations based on assessment
function generatePersonalizedRecommendations(riskLevel: string, riskFactors: string[], answers: Record<string, any>): string[] {
  const recommendations: string[] = [];
  
  // Immediate medical attention for symptoms
  if (answers.breast_symptoms && answers.breast_symptoms !== "No, I don't have any symptoms") {
    recommendations.push("🚨 URGENT: Schedule immediate consultation with healthcare provider for breast symptoms");
  }
  
  // High risk recommendations
  if (riskLevel === 'high') {
    recommendations.push("📋 Consult with breast cancer specialist or genetic counselor");
    recommendations.push("🔬 Consider genetic testing if family history present");
    recommendations.push("📅 More frequent screening - discuss with doctor");
    if (answers.mammogram === "Never") {
      recommendations.push("🏥 Schedule mammogram immediately");
    }
  }
  
  // Moderate risk recommendations
  if (riskLevel === 'moderate') {
    recommendations.push("📋 Regular consultations with healthcare provider");
    recommendations.push("📅 Follow recommended screening schedule");
    if (answers.mammogram === "Never" && answers.age > 40) {
      recommendations.push("🏥 Schedule annual mammogram");
    }
  }
  
  // Universal recommendations
  recommendations.push("🔍 Perform monthly breast self-examinations");
  
  // Lifestyle recommendations
  if (answers.exercise === "No, little or no regular exercise") {
    recommendations.push("🏃‍♀️ Start regular exercise routine (150 min/week)");
  }
  if (answers.bmi && answers.bmi > 25) {
    recommendations.push("⚖️ Work towards healthy weight range");
  }
  if (answers.smoking === "Yes") {
    recommendations.push("🚭 Consider smoking cessation programs");
  }
  if (answers.alcohol === "Yes") {
    recommendations.push("🍷 Limit alcohol consumption");
  }
  
  // Stress and nutrition
  if (answers.stress === "Yes, chronic high stress") {
    recommendations.push("🧘‍♀️ Practice stress management techniques");
  }
  if (answers.sugar_diet === "Yes, high sugar diet") {
    recommendations.push("🥗 Adopt anti-inflammatory diet rich in fruits and vegetables");
  }
  
  return recommendations;
}

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});

  const handleQuizComplete = async (answers: Record<string, any>) => {
    console.log("Quiz completed with answers:", answers);
    setQuizAnswers(answers);
    
    try {
      // Calculate comprehensive risk score based on quiz answers
      const { riskScore, riskLevel, recommendations } = calculateRiskAssessment(answers);
      
      // Submit quiz results to database
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers,
          risk_score: riskScore,
          risk_level: riskLevel,
          recommendations,
          user_id: 'anonymous_user' // Will be replaced with actual user ID later
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Quiz results saved to MongoDB database:', result.session_id);
        // Store session ID to fetch report from database later
        localStorage.setItem('brezcode_quiz_session_id', result.session_id);
      } else {
        console.error('❌ Failed to save quiz results to database');
        // No fallback - database is required
        throw new Error('Database save failed');
      }
    } catch (error) {
      console.error('❌ Error submitting quiz to database:', error);
      // No fallback storage - show error to user
      alert('Unable to save quiz results to database. Please try again.');
      return;
    }
    
    // Start the proper flow: quiz → transition → signup → dashboard
    setQuizCompleted(true);
    setShowTransition(true);
  };

  const handleQuizClose = () => {
    window.location.href = '/';
  };

  const handleTransitionContinue = () => {
    setShowTransition(false);
  };

  const handleSignupComplete = () => {
    // After successful signup, redirect to dashboard
    window.location.href = '/dashboard';
  };

  // Show transition page after quiz completion
  if (quizCompleted && showTransition) {
    return <QuizTransition onContinue={handleTransitionContinue} />;
  }

  // Show signup flow after transition
  if (quizCompleted && !showTransition) {
    return (
      <CleanSignupFlow 
        quizAnswers={quizAnswers} 
        onComplete={handleSignupComplete}
      />
    );
  }

  // Show quiz initially
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Quiz onComplete={handleQuizComplete} onClose={handleQuizClose} />
    </div>
  );
}