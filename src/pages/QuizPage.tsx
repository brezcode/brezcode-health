import { useState } from 'react'
import Quiz from '../components/Quiz'

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});

  const handleQuizComplete = (answers: Record<string, any>) => {
    console.log('Quiz completed with answers:', answers);
    setQuizAnswers(answers);
    setQuizCompleted(true);
    // Store answers in localStorage for report generation
    localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
    alert('Quiz completed! Check console for results. Results have been saved.');
  };

  const handleQuizClose = () => {
    window.location.href = '/';
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing the breast health assessment. Your results have been saved and will be used to create your personalized health plan.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Quiz 
        onComplete={handleQuizComplete}
        onClose={handleQuizClose}
      />
    </div>
  );
}