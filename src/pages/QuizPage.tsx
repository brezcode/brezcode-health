import { useState } from "react";
import Quiz from "../components/Quiz";
import QuizTransition from "../components/QuizTransition";
import AntdSignupFlow from "../components/AntdSignupFlow";

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});

  const handleQuizComplete = (answers: Record<string, any>) => {
    console.log("Quiz completed with answers:", answers);
    setQuizAnswers(answers);
    // Store answers in localStorage for report generation
    localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
    
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
      <AntdSignupFlow 
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