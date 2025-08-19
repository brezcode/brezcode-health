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
            <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-gray-700">Hey Sue, how'd it go yesterday?</p>
            </div>

            <div className="absolute top-20 right-8 bg-purple-500 rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-white">I am following the plan, and feeling great today!</p>
            </div>

            <div className="absolute bottom-20 left-4 bg-green-500 rounded-2xl p-3 shadow-lg max-w-40 z-20">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleTakeQuiz}
                className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all border-none cursor-pointer"
              >
                Take the quiz to start
              </button>
              <button 
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3 rounded-full text-lg font-bold transition-all bg-transparent cursor-pointer"
              >
                🗓️ Create My Health Plan
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-blue-500">BrezCode Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Weekly planning</h3>
            <p className="text-gray-600 leading-relaxed">
              Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Resources</h3>
            <p className="text-gray-600 leading-relaxed">
              Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">24/7 Coaching</h3>
            <p className="text-gray-600 leading-relaxed">
              If you want any support or query, our AI coach trained by medical experts is always just a text message away, 24x7.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart Alerts</h3>
            <p className="text-gray-600 leading-relaxed">
              Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Evidence-Based <span className="text-blue-500">Activities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Discover personalized activities backed by medical research to optimize your breast health and overall wellness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Mobile Phone Frame</h3>
            <p className="text-gray-600 leading-relaxed">
              Access evidence-based activities right from your mobile device with our intuitive interface designed for daily health management.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🧘‍♀️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Daily Wellness</h3>
            <p className="text-gray-600 leading-relaxed">
              Engage in scientifically-proven wellness activities including mindfulness, exercise routines, and nutrition guidance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Progress Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your health journey with detailed analytics and personalized insights based on your daily activities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Users <span className="text-blue-500">Are Saying</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Real stories from women who have transformed their health journey with BrezCode.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h4 className="font-semibold">Sarah M.</h4>
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              "BrezCode helped me understand my risk factors and gave me a clear action plan. The AI coach is incredibly supportive and knowledgeable."
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h4 className="font-semibold">Maria L.</h4>
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              "The personalized recommendations are amazing. I've made real changes to my lifestyle and feel more confident about my health."
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">J</span>
              </div>
              <div>
                <h4 className="font-semibold">Jennifer K.</h4>
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              "Having 24/7 access to evidence-based health guidance has been life-changing. BrezCode is like having a health expert in my pocket."
            </p>
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

function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Results from real people like you
          </h2>
          <p className="text-lg text-gray-500 italic">
            These are real customer reviews, and we have hundreds more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500">
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-6">Mia</p>
            <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
              "As a young woman, I ignored breast health. This app's fun, quick lessons taught me to listen to my body and act early!"
            </blockquote>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Real BrezCode Customer</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500">
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                E
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-6">Emily</p>
            <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
              "I found a lump and panicked. The app guided me through self-exams and screening info, helping me stay calm and get answers fast."
            </blockquote>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Real BrezCode Customer</span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-teal-500">
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-6">Aisha</p>
            <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
              "My sister had breast cancer, so I'm high-risk. The app's risk scoring and check-in reminders help me feel in control of my health!"
            </blockquote>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Real BrezCode Customer</span>
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
      <Reviews />
      <FAQ />
      <Promise />
      <Testimonials />
      <Results />
      <SignUp />
      <Footer />
    </div>
  )
}

export default App
