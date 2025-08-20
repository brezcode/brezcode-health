import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  profilePhoto?: string;
}

export default function UserDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I can help you with breast health questions, lifestyle recommendations, and understanding your assessment results. What would you like to know?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('chat');

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('brezcode_user') || '{}');
  const currentUser: User = {
    id: 1,
    firstName: userData.firstName || 'User',
    lastName: userData.lastName || '',
    email: userData.email || 'user@example.com',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isSending) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsSending(true);

    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }]);

    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponses = [
        "Based on your assessment results, I recommend focusing on regular physical activity and maintaining a healthy diet rich in fruits and vegetables.",
        "That's a great question! According to current research, regular self-examinations combined with clinical screenings provide the best early detection approach.",
        "I understand your concern. Let me provide you with evidence-based information to help you make informed decisions about your health.",
        "Your personalized plan takes into account your specific risk factors. Would you like me to explain any particular recommendation in more detail?",
        "Regular exercise, especially 150 minutes of moderate activity per week, can significantly reduce breast cancer risk according to multiple studies."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">BrezCode Health</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {currentUser.firstName}!
              </h1>
              <p className="text-gray-600">
                <span className="text-sm text-blue-600 block">
                  {currentUser.email}
                </span>
                Your personalized health dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Health Stats */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <h3 className="text-lg font-bold">Health Metrics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span className="text-xs font-medium">Health Score</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">78/100</div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <span className="text-xs font-medium">Risk Level</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">Low</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Assessment Complete</span>
                    <span className="text-sm text-green-600">✓</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last completed: Today
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.href = '/report'}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">View Full Report</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-6 4v10m-2-2h4"></path>
                    </svg>
                    <span className="text-sm font-medium">Daily Plan</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="w-full">
              {/* Tab Navigation */}
              <div className="grid w-full grid-cols-2 mb-4">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`py-2 px-4 font-medium rounded-l-lg border ${
                    activeTab === 'chat' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  AI Health Assistant
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className={`py-2 px-4 font-medium rounded-r-lg border ${
                    activeTab === 'tools' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Health Tools
                </button>
              </div>

              {activeTab === 'chat' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 h-[600px]">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"></path>
                        </svg>
                        <h2 className="text-xl font-bold">Health AI Assistant</h2>
                      </div>
                    </div>
                    
                    <div className="h-full flex flex-col p-0">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                {message.role === 'user' ? (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isSending && (
                          <div className="flex gap-3 justify-start">
                            <div className="flex gap-2 max-w-[80%]">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"></path>
                                </svg>
                              </div>
                              <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Ask me about your health assessment, recommendations, or breast health in general..."
                            disabled={isSending}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          />
                          <button 
                            type="submit" 
                            disabled={isSending || !currentMessage.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold">Health Management Tools</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div 
                          onClick={() => window.location.href = '/report'}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow group"
                        >
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">Assessment Report</h3>
                          <p className="text-sm text-gray-600 mb-3">View your complete health assessment and recommendations</p>
                          <div className="flex items-center text-blue-500 text-sm font-medium">
                            View Report
                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow group">
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-6 4v10m-2-2h4"></path>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">Daily Health Plan</h3>
                          <p className="text-sm text-gray-600 mb-3">Personalized daily activities and health recommendations</p>
                          <div className="flex items-center text-blue-500 text-sm font-medium">
                            View Plan
                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow group">
                          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">Retake Assessment</h3>
                          <p className="text-sm text-gray-600 mb-3">Update your health profile with a new assessment</p>
                          <div className="flex items-center text-blue-500 text-sm font-medium">
                            Start Assessment
                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}