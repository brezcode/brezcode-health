interface QuizTransitionProps {
  onContinue: () => void;
}

export default function QuizTransition({ onContinue }: QuizTransitionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="text-center p-6 border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations! Quiz Complete
          </h1>
          <p className="text-lg text-gray-600">
            You've successfully completed your comprehensive breast health assessment
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              What's Next?
            </h3>
            <p className="text-blue-700">
              Based on your responses, we're preparing a personalized assessment report with evidence-based recommendations tailored specifically for your breast health profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
              <svg className="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <h4 className="font-semibold text-gray-800">Comprehensive Report</h4>
                <p className="text-sm text-gray-600">Detailed analysis of your risk factors and personalized recommendations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
              <svg className="w-6 h-6 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <div>
                <h4 className="font-semibold text-gray-800">Personalized Health Schedule</h4>
                <p className="text-sm text-gray-600">Daily activities tailored to your assessment results and health goals</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Complete Your Registration
                </h4>
                <p className="text-yellow-700 mb-4">
                  To provide you with your personalized assessment report and begin your breast health coaching journey, we need to complete your account setup.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Secure your account with email verification</li>
                  <li>• Enable SMS notifications for important health reminders</li>
                  <li>• Ensure we can deliver your personalized report safely</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button 
              onClick={onContinue}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all"
            >
              Continue to Registration
            </button>
            <p className="text-sm text-gray-500 mt-3">
              This will only take 2-3 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}