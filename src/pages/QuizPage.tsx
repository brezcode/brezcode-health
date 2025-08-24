import { useState } from "react";
import Quiz from "../components/Quiz";
import QuizTransition from "../components/QuizTransition";
import CleanSignupFlow from "../components/CleanSignupFlow";

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});

  const handleQuizComplete = async (answers: Record<string, any>) => {
    console.log("Quiz completed with answers:", answers);
    setQuizAnswers(answers);
    
    try {
      // Calculate basic risk score and level (simplified for now)
      const riskScore = Math.floor(Math.random() * 100); // Placeholder calculation
      const riskLevel = riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : 'high';
      const recommendations = ['Take regular self-exams', 'Schedule yearly mammograms', 'Maintain a healthy lifestyle'];
      
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
        console.log('✅ Quiz results saved to database:', result.session_id);
        // Store session ID for later retrieval
        localStorage.setItem('brezcode_quiz_session_id', result.session_id);
        // Keep answers in localStorage for immediate access during signup flow
        localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
      } else {
        console.error('❌ Failed to save quiz results');
        // Fallback to localStorage only
        localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
      }
    } catch (error) {
      console.error('❌ Error submitting quiz results:', error);
      // Fallback to localStorage only
      localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
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