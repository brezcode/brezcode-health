import React, { useEffect, useState } from 'react';
import HealthScoreCard from '../components/HealthScoreCard';
import PersonalizedInsights from '../components/PersonalizedInsights';
import DetailedSectionAnalysis from '../components/DetailedSectionAnalysis';
import UrgencyRiskMessage from '../components/UrgencyRiskMessage';
import HopeBasedActionPlan from '../components/HopeBasedActionPlan';

export default function EnhancedReportPageLive() {
  const [report, setReport] = useState<any>(null);
  const [detailedReport, setDetailedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnhancedReportFromDatabase = async () => {
      try {
        console.log('🏥 Loading enhanced health report from API...');
        
        // Fetch enhanced insights data
        const insightsResponse = await fetch('/api/insights/test');
        const insightsResult = await insightsResponse.json();
        
        // Fetch detailed report data with section summaries
        const reportResponse = await fetch('/api/reports/latest');
        const reportResult = await reportResponse.json();
        
        if (insightsResult.success && insightsResult.report) {
          console.log('✅ Enhanced insights loaded from database');
          setReport(insightsResult.report);
        }
        
        if (reportResult.success && reportResult.report) {
          console.log('✅ Detailed report with section summaries loaded from database');
          setDetailedReport(reportResult.report);
          setError(null);
        } else {
          console.error('❌ No detailed report found:', reportResult.error);
          setError('No comprehensive health report found. Please complete the quiz first.');
        }
        
      } catch (error) {
        console.error('❌ Database error loading enhanced report:', error);
        setError('Unable to connect to database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEnhancedReportFromDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enhanced health report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Report</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Take Health Quiz
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No report data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  BrezCode Health Report
                </h1>
                <p className="text-sm text-gray-600">Your Personalized Health Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Enhanced Health Report
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your assessment, here are your personalized insights with evidence-based recommendations and expert guidance.
          </p>
        </div>

        {/* Enhanced Dashboard Components - Conversion Psychology Flow */}
        <div className="space-y-8 mb-8">
          {/* PHASE 1: URGENCY - Unmodifiable Risk Factors & Emotional Triggers */}
          {report.insights?.evidenceBasedRisk && (
            <UrgencyRiskMessage 
              evidenceBasedRisk={report.insights.evidenceBasedRisk}
              userProfile={{
                hasChildren: report.userProfile?.hasChildren,
                age: parseInt(report.userProfile?.age || '35'),
                name: report.userProfile?.name
              }}
            />
          )}

          {/* Traditional Health Score (for reference) */}
          <HealthScoreCard 
            score={parseInt(report.riskScore) || 0}
            riskCategory={report.riskCategory}
            improvementPotential={report.insights?.improvement_potential}
          />

          {/* PHASE 2: HOPE - Evidence-Based Action Plan */}
          {report.insights?.evidenceBasedRisk && (
            <HopeBasedActionPlan 
              evidenceBasedRisk={report.insights.evidenceBasedRisk}
            />
          )}

          {/* Detailed Section Analysis */}
          {detailedReport?.reportData?.sectionAnalysis && (
            <DetailedSectionAnalysis 
              sectionAnalysis={detailedReport.reportData.sectionAnalysis}
            />
          )}

          {/* Personalized Insights */}
          <PersonalizedInsights insights={report.insights} />
        </div>

        {/* Enhanced Personalized Action Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Your Personalized Breast Health Action Plan</h3>
          
          {/* Self-Care Routine */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-pink-600">💆‍♀️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Daily Self-Care Routine</h4>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 5-minute breast massage with nanoemulsion therapy cream</span>
                <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded">Daily</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• Monthly BSE using 6-step method (day 10-14 after period)</span>
                <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded">Monthly</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• Weekly skin texture and symmetry monitoring</span>
                <span className="text-xs bg-pink-200 text-pink-700 px-2 py-1 rounded">Weekly</span>
              </div>
            </div>
          </div>

          {/* Nutrition Plan */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600">🥗</span>
              </div>
              <h4 className="font-semibold text-gray-900">Mediterranean Nutrition Plan</h4>
            </div>
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 5-9 servings of colorful fruits and vegetables daily</span>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">15-20% risk reduction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 2-3 cups green tea daily for EGCG antioxidants</span>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">10% risk reduction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• Omega-3 rich fish twice weekly + flaxseed daily</span>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">14% risk reduction</span>
              </div>
            </div>
          </div>

          {/* Active Living Plan */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600">🏃‍♀️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Active Living Plan</h4>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 150 minutes moderate cardio weekly (brisk walking counts!)</span>
                <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">20-30% risk reduction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 2-3 strength training sessions for hormone balance</span>
                <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">10% risk reduction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• Daily 10-minute yoga or stretching for lymphatic flow</span>
                <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">Stress reduction</span>
              </div>
            </div>
          </div>

          {/* Mindfulness & Stress Management */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600">🧘‍♀️</span>
              </div>
              <h4 className="font-semibold text-gray-900">Mindfulness & Stress Management</h4>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 10-minute daily meditation (MBSR technique)</span>
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">25% cortisol reduction</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 4-7-8 breathing exercises during stressful moments</span>
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">Immune boost</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">• 7-9 hours quality sleep with consistent bedtime</span>
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">50% risk reduction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations Section */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🛍️ Recommended Products for Your Health Journey</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-pink-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🧴</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Xynargy Breast Therapy Cream</h4>
                  <p className="text-xs text-gray-600">Curcumin + Ginseng + Green Tea Formula</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Perfect for daily massage routine. Contains nano-encapsulated curcumin for inflammation reduction 
                and ginseng for circulation enhancement.
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-pink-500 text-white text-sm px-3 py-2 rounded hover:bg-pink-600">
                  Order Now
                </button>
                <button className="text-sm border border-pink-300 text-pink-600 px-3 py-2 rounded hover:bg-pink-50">
                  Learn More
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🔬</span>
                <div>
                  <h4 className="font-semibold text-gray-900">BG Home Screening Device</h4>
                  <p className="text-xs text-gray-600">AI-Powered Early Detection</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Monthly at-home breast screening using thermal imaging and AI analysis. 
                Detects subtle changes 2-3 years before traditional methods.
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-500 text-white text-sm px-3 py-2 rounded hover:bg-purple-600">
                  Schedule Demo
                </button>
                <button className="text-sm border border-purple-300 text-purple-600 px-3 py-2 rounded hover:bg-purple-50">
                  View Report
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-green-100">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">💊</span>
              <div>
                <h4 className="font-semibold text-gray-900">Personalized Supplement Bundle</h4>
                <p className="text-xs text-gray-600">Based on Your Risk Profile & Age</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900">Vitamin D3</div>
                <div className="text-gray-600">2000 IU daily</div>
                <div className="text-xs text-green-600">20% risk reduction</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Omega-3</div>
                <div className="text-gray-600">2g daily</div>
                <div className="text-xs text-green-600">14% risk reduction</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Green Tea Extract</div>
                <div className="text-gray-600">300mg EGCG</div>
                <div className="text-xs text-green-600">10% risk reduction</div>
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="flex-1 bg-green-500 text-white text-sm px-3 py-2 rounded hover:bg-green-600">
                Order Bundle
              </button>
              <button className="text-sm border border-green-300 text-green-600 px-3 py-2 rounded hover:bg-green-50">
                Customize
              </button>
            </div>
          </div>
        </div>

        {/* Join Daily Program Section */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-lg p-8 text-yellow-100 text-center mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">🌟 Ready to Transform Your Health Journey?</h2>
            <p className="text-xl mb-2 opacity-95">
              Join Sarah and 10,000+ women who've taken control of their breast health
            </p>
            <p className="text-lg mb-6 opacity-80">
              Get personalized daily plans, expert guidance, and 24/7 support on your wellness journey
            </p>
            
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">📱</span>
                  <h3 className="font-semibold">Daily WhatsApp Coaching</h3>
                </div>
                <p className="text-sm opacity-90">Personalized reminders, tips, and motivation delivered directly to your phone</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="font-semibold">Customized Action Plans</h3>
                </div>
                <p className="text-sm opacity-90">Age-specific plans tailored to your risk level and life stage</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">🛍️</span>
                  <h3 className="font-semibold">Expert Product Guidance</h3>
                </div>
                <p className="text-sm opacity-90">Evidence-based recommendations for creams, devices, and supplements</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">👥</span>
                  <h3 className="font-semibold">Supportive Community</h3>
                </div>
                <p className="text-sm opacity-90">Connect with like-minded women on similar health journeys</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                    +10K
                  </div>
                </div>
              </div>
              <p className="text-sm italic opacity-90">
                "I've reduced my anxiety by 60% and feel more in control of my health than ever before!" - Sarah M.
              </p>
            </div>
            
            <button 
              onClick={() => alert('Join Daily Health Program - Coming Soon!')}
              className="bg-white text-purple-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
            >
              🚀 Start Your Personalized Program Today
            </button>
            
            <div className="flex justify-center items-center space-x-6 text-sm opacity-80">
              <div className="flex items-center">
                <span className="mr-1">✅</span> Cancel anytime
              </div>
              <div className="flex items-center">
                <span className="mr-1">💝</span> 30-day guarantee
              </div>
              <div className="flex items-center">
                <span className="mr-1">📞</span> 24/7 support
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-3">Need Help Understanding Your Report?</h3>
          <p className="text-sm mb-4 opacity-90">
            Our AI coach is here to help you understand your results and take action.
          </p>
          <div className="space-y-3 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button 
              onClick={() => alert('AI Chat feature coming soon!')}
              className="w-full md:w-auto bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              🤖 Chat with AI Coach
            </button>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="w-full md:w-auto border border-gray-400 text-gray-200 px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
            >
              🔄 Update Assessment
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Important Disclaimer</h4>
          <p className="text-sm text-gray-700">
            This report is for informational purposes only and should not replace professional medical advice. 
            Always consult with qualified healthcare providers for medical decisions and treatment recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}