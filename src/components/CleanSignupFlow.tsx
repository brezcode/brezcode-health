import { useState } from "react";

interface CleanSignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function CleanSignupFlow({ quizAnswers, onComplete }: CleanSignupFlowProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulate signup API call
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data and quiz answers locally for demo
      localStorage.setItem('brezcode_user', JSON.stringify({
        ...formData,
        password: undefined, // Don't store password
        quizAnswers,
        registeredAt: new Date().toISOString()
      }));
      
      // Simulate sending verification email
      console.log("Sending verification email to:", formData.email);
      setStep(2);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate email verification
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, accept any 6-digit code
      if (verificationCode.length === 6) {
        // Mark as verified
        const userData = JSON.parse(localStorage.getItem('brezcode_user') || '{}');
        userData.emailVerified = true;
        userData.verifiedAt = new Date().toISOString();
        localStorage.setItem('brezcode_user', JSON.stringify(userData));
        
        console.log("Email verified successfully");
        onComplete();
      } else {
        setError("Invalid verification code");
      }
    } catch (error: any) {
      setError(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl">
          <div className="p-6 space-y-4 border-b border-gray-200">
            <div className="w-32 mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
            </div>
            <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
            <p className="text-gray-600 text-center">Enter your details to get started</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L14.12 14.12m-4.242-4.242L14.12 14.12M21 12c-1.27 4.057-5.065 7-9.543 7-.84 0-1.659-.109-2.457-.317m4.457-4.457l-4.457-4.457"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  isLoading || 
                  formData.password !== formData.confirmPassword ||
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword
                }
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-6 space-y-4 border-b border-gray-200">
          <div className="w-32 mx-auto bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
          <p className="text-gray-600 text-center">
            We sent a verification code to {formData.email}
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-3 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                For demo: enter any 6-digit number (e.g., 123456)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={() => setStep(1)}
            >
              Back to Account Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}