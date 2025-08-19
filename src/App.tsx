import './App.css'

function Hero() {
  const handleTakeQuiz = () => {
    window.open('/quiz', '_blank');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 mt-8">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white text-sm font-medium">Evidence-based AI coaching available 24/7</span>
          </div>

          <p className="text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            "1 in 8 women in US will develop breast cancer in their lifetime"... According to WHO
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Good news! You can now <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">REVERSE</span> the development<br />
            and lower the risk by <span className="text-yellow-400">100% in 15 days.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed italic">
            The #1 evidence-based AI breast health coaching platform to help you
          </p>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed italic">
            regain control of your wellness.
          </p>

          <p className="text-lg text-white/90 mb-12 max-w-3xl mx-auto">
            Don't wait until it is too late, your family depends on you.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={handleTakeQuiz}
              className="bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-lg transition-all hover:scale-105 border-none cursor-pointer"
            >
              Take the quiz to start
            </button>
            <button 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-bold transition-all bg-transparent cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>

          <p className="text-white/80 text-lg mb-16">
            Start for free. Cancel any time.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start pb-0">
          <div className="relative flex justify-center items-end" style={{ height: '500px' }}>
            {/* Yellow Circle Background */}
            <div className="w-80 h-80 bg-yellow-400 rounded-full absolute" style={{ bottom: '120px' }}></div>
            {/* Woman Image */}
            <img 
              src="/happy-woman.png"
              alt="Happy woman using phone"
              className="relative z-10 object-contain object-bottom"
              style={{
                width: '24rem',
                height: '30rem',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />

            {/* Chat Bubbles */}
            <div className="absolute top-8 left-8 bg-white rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-gray-700">Hey Sue, how'd it go yesterday?</p>
            </div>

            <div className="absolute top-24 right-4 bg-purple-500 rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-white">I am following the plan, and feeling great today!</p>
            </div>

            <div className="absolute bottom-32 left-2 bg-green-500 rounded-2xl p-3 shadow-lg max-w-40 z-20">
              <p className="text-sm text-white">Great work sticking to your plan!</p>
            </div>
          </div>

          <div className="text-left">
            <div className="text-6xl font-bold text-white mb-4">96%</div>
            <div className="text-2xl font-bold text-white mb-4">
              of members report<br />
              reduced anxiety after 90 days
            </div>
            <p className="text-blue-100 mb-8">
              In addition, BrezCode members feel accomplished by an average of 80% after 90 days, as verified in a third-party study.
            </p>

            <div className="flex justify-center">
              <button 
                onClick={handleTakeQuiz}
                className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all border-none cursor-pointer"
              >
                Take the quiz to start
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">BC</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              How <span className="text-blue-500">BrezCode Works</span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Weekly planning</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Community</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Resources</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">24/7 Coaching</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you want any support or query, our AI coach trained by medical experts is always just a text message away, 24x7.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Progress Tracking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Smart Alerts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskReductionChart() {
  const data = [
    { name: 'Breathing', reduction: 15, fullName: 'Daily 5mins breathing exercise' },
    { name: 'Mindfulness', reduction: 5, fullName: 'Daily 10mins mindfulness exercise' },
    { name: 'Massage', reduction: 20, fullName: '3x/weekly Self Breast Massage' },
    { name: 'Diet', reduction: 20, fullName: 'Personalized dietary management' },
    { name: 'Exercise', reduction: 40, fullName: 'Daily Physical exercise tracking' },
    { name: 'Exam', reduction: 20, fullName: 'Monthly Self Breast Exam' },
    { name: 'Education', reduction: 5, fullName: 'Daily educational content and tips' },
    { name: 'AI Monitor', reduction: 50, fullName: 'AI-Risk Monitoring system' }
  ];

  const getBarWidth = (value) => {
    return (value / 50) * 100; // 50% is the max value
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
      {/* Mobile Phone Frame */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-72 bg-gray-900 rounded-3xl p-3 shadow-2xl" style={{ height: '580px' }}>
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-3xl overflow-hidden relative">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-lg z-10"></div>

              {/* Chart Content */}
              <div className="pt-6 px-3 h-full">
                {/* Header inside phone */}
                <div className="text-center mb-4">
                  <h3 className="text-sm font-bold text-green-600 mb-1">
                    🎉 Reach Risk Reduction of 100% 🎊
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Combine all activities for maximum protection! 🌟
                  </p>
                  <h4 className="text-xs font-bold text-gray-800 mb-3">Risk Reduction by Activity</h4>
                </div>

                {/* Activity Bars */}
                <div className="space-y-2">
                  {data.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-1 relative flex items-center">
                        <div 
                          className="bg-blue-600 h-6 rounded-sm flex items-center px-2 transition-all duration-500 ease-out"
                          style={{ width: `${getBarWidth(item.reduction)}%`, minWidth: '80px' }}
                        >
                          <span className="text-white font-bold text-xs truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-gray-800 font-bold text-xs ml-2 min-w-6">
                          {item.reduction}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phone Home Indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Risk Reduction Summary */}
      <div>
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold">Total Risk Reduction: 175% 🎯</div>
            <div className="text-lg opacity-90 mt-2">Maximum protection achieved! 🛡️</div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Our evidence-based approach combines multiple scientifically-proven methods to maximize your breast cancer risk reduction.
          </p>
          <p className="text-sm text-gray-500">
            Each activity contributes to your overall health protection score, with AI monitoring providing the highest individual impact.
          </p>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const handleTakeQuiz = () => {
    window.open('/quiz', '_blank');
  };

  const activities = [
    {
      title: 'Daily 5mins breathing exercise',
      description: 'Lower Chronic stress',
      reduction: '-15% risk',
      icon: "🫁"
    },
    {
      title: 'Daily 10mins mindfulness exercise',
      description: 'Increase positivity',
      reduction: '-5% risk',
      icon: "🧘‍♀️"
    },
    {
      title: '3x/weekly Self Breast Massage',
      description: 'Lower Chronic inflammation',
      reduction: '-20% risk',
      icon: "💆‍♀️"
    },
    {
      title: 'Personalized dietary management',
      description: 'Lower Carcinogen',
      reduction: '-20% risk',
      icon: "🥗"
    },
    {
      title: 'Daily Physical exercise tracking',
      description: 'Lower oxidative stress',
      reduction: '-40% risk',
      icon: "🏃‍♀️"
    },
    {
      title: 'Monthly Self Breast Exam',
      description: 'Early Symptom Detection',
      reduction: '-20% risk',
      icon: "🔍"
    },
    {
      title: 'Daily educational content and tips',
      description: 'Increase awareness',
      reduction: '-5% risk',
      icon: "📚"
    },
    {
      title: 'AI-Risk Monitoring system',
      description: 'Early detection',
      reduction: '-50% risk',
      icon: "🤖"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Evidence-based activities to reverse breast cancer development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All activities are scientifically proven to reduce breast cancer risk
          </p>
        </div>

        <RiskReductionChart />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <div key={index} className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="text-2xl mb-3">{activity.icon}</div>
              <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                {activity.reduction}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Summary with Yoga Lady */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-blue-600">Brezcode can help you</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Reduce breast cancer risk</h4>
                    <p className="text-gray-600">No matter where you are on your journey, Brezcode can help you reduce risk, with no pressure to be perfect.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Gain control over your wellness</h4>
                    <p className="text-gray-600">We'll teach you the science-backed habits and techniques to gain control over your breast health.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Reduce anxiety and stress</h4>
                    <p className="text-gray-600">The days of anxiety ruining your day or week are over. Learn to enjoy peace of mind with fewer negative effects.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Improve your well-being</h4>
                    <p className="text-gray-600">Taking care of your health can have a big positive impact on your sleep, mental health, relationships, and more.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleTakeQuiz}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all border-none cursor-pointer"
                >
                  Take the quiz to start
                </button>
              </div>
            </div>

            {/* Right side - Yoga Lady Image */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center" style={{ height: '384px' }}>
                  <img 
                    src="/yoga-lady.png"
                    alt="Woman meditating in peaceful pose"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const handleTakeQuiz = () => {
    window.open('/quiz', '_blank');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Free 15-day trial, then <span className="text-blue-500">simple pricing</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-xl p-12 border-2 border-blue-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold">
                ⭐ BEST VALUE
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">BrezCode Premium</h3>
              <div className="text-6xl font-bold mb-2 text-blue-500">
                Free
              </div>
              <p className="text-xl text-gray-600 mb-2">15 days, then $4.99/month</p>
              <p className="text-gray-500 mb-8">Cancel anytime • No hidden fees</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Easy Risk scoring and tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weekly Planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Analytics & dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personalized recommendations</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AI chatbot messaging interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Supportive community</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Focus on moderation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Affordable cost</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTakeQuiz}
                className="w-full py-4 rounded-full font-bold text-xl bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-lg transition-all hover:scale-105 border-none cursor-pointer"
              >
                Take the quiz to start
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Start immediately • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <span className="font-semibold">30-day money-back guarantee</span> • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
}

function ReviewsAndTestimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real BrezCode customers
          </h2>
        </div>

        {/* Combined Customer Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                S
              </div>
              <div>
                <h3 className="font-bold text-lg">Sarah Chen</h3>
                <p className="text-gray-600">Age 34, Marketing Director</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "I was skeptical about health apps, but BrezCode changed everything. The personalized recommendations helped me reduce my diabetes risk by 40% in just 6 months."
            </p>
            <div className="flex text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                M
              </div>
              <div>
                <h3 className="font-bold text-lg">Michael Torres</h3>
                <p className="text-gray-600">Age 42, Teacher</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "The evidence-based approach convinced me. Following BrezCode's plan, I lowered my heart disease risk by 35% and lost 25 pounds. My doctor was amazed!"
            </p>
            <div className="flex text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                L
              </div>
              <div>
                <h3 className="font-bold text-lg">Lisa Rodriguez</h3>
                <p className="text-gray-600">Age 38, Nurse</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              "As a healthcare professional, I appreciate BrezCode's scientific foundation. It helped me achieve a 45% reduction in my cancer risk through lifestyle changes."
            </p>
            <div className="flex text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Is my health information secure?</h3>
            <p className="text-gray-600">Yes, we use bank-level encryption and are HIPAA compliant. Your health data is never shared with third parties.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">How accurate are the risk assessments?</h3>
            <p className="text-gray-600">Our assessments are based on evidence-based medical research and validated risk models used by healthcare professionals.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Is this a replacement for medical care?</h3>
            <p className="text-gray-600">No, BrezCode is designed to complement your healthcare, not replace it. Always consult with healthcare professionals for medical decisions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Promise() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Promise to You
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-12">
              We know this is a deeply personal journey for you, as it was for us. We follow a strict code of conduct and promise to always put your health and wellness above all else.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">No shame or guilt ever</h3>
                <p className="text-white/90">
                  Mindful lifestyle is about celebrating our wins, not making you feel bad.
                </p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Always private and secure</h3>
                <p className="text-white/90">
                  This is a personal, private journey for you. We make privacy a top priority.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Money back guarantee</h3>
                <p className="text-white/90">
                  If you give it a fair shot and aren't happy after 30 days, just let us know!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Results() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            With measurable impact
          </h2>
          <p className="text-lg text-gray-500 italic">
            Results reported from a recent customer survey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">96% feel less anxiety</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">90% improve diet quality</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">87% have better sleep</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">80% feel accomplished</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">75% improve mental health</span>
            </div>
            <div className="flex items-center text-lg text-gray-800">
              <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
              <span className="font-medium">100% improve breast health</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignUp() {
  const handleTakeQuiz = () => {
    window.open('/quiz', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-400 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of women taking control of their breast health with personalized AI guidance and support.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="space-y-4">
              <button 
                onClick={handleTakeQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6 rounded-lg border-none cursor-pointer transition-all"
              >
                Start Your Health Assessment
              </button>
              <p className="text-center text-sm text-gray-500 mb-4">
                Complete our 23-question assessment to get personalized insights
              </p>
              
              <div className="border-t pt-4">
                <button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3 px-6 rounded-lg border-none cursor-pointer transition-all"
                >
                  🔍 Skin Lesion Test
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Quick AI-powered skin lesion analysis using your camera
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="text-xl font-semibold">BrezCode</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering women with AI-driven breast health insights and personalized coaching for proactive wellness management.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 BrezCode. All rights reserved. This service is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <ReviewsAndTestimonials />
      <FAQ />
      <Promise />
      <Results />
      <SignUp />
      <Footer />
    </div>
  )
}

export default App
// Force rebuild
