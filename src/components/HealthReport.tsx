interface HealthReportProps {
  report: {
    id: number;
    riskScore: string;
    riskCategory: 'low' | 'moderate' | 'high';
    userProfile: 'teenager' | 'premenopausal' | 'postmenopausal' | 'current_patient' | 'survivor';
    riskFactors: string[];
    recommendations: string[];
    dailyPlan: Record<string, any>;
    reportData: {
      summary: {
        totalRiskScore: string;
        overallRiskCategory: string;
        userProfile: string;
        profileDescription: string;
        totalSections: number;
        totalHealthScore?: string;
        uncontrollableHealthScore?: string;
      };
      sectionAnalysis: {
        sectionScores: { [key: string]: { score: number, factors: string[] } };
        sectionSummaries: { [key: string]: string };
        sectionBreakdown: Array<{ 
          name: string; 
          score: number; 
          factorCount: number; 
          riskLevel: string;
          riskFactors?: string[];
        }>;
      };
      personalizedPlan: {
        dailyPlan: Record<string, any>;
        coachingFocus: string[];
        followUpTimeline: Record<string, string>;
      };
    };
    createdAt: string;
    userInfo?: {
      firstName?: string;
    };
  };
}

function getRiskBadgeVariant(riskLevel: string) {
  switch (riskLevel) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';          
    case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';   
    case 'high': return 'bg-red-100 text-red-800 border-red-200';         
    case 'very_high': return 'bg-red-100 text-red-800 border-red-200'; 
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getUncontrollableHealthCategory(score: number): string {
  if (score >= 80) return 'Low Risk';       
  if (score >= 65) return 'Moderate Risk';  
  if (score >= 50) return 'High Risk';      
  return 'Very High Risk';                        
}

function getUncontrollableRiskVariant(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';       
  if (score >= 65) return 'bg-yellow-100 text-yellow-800 border-yellow-200';     
  if (score >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';       
  return 'bg-red-100 text-red-800 border-red-200';                    
}

function getProfileIcon(profile: string) {
  switch (profile) {
    case 'teenager': return '🌱';
    case 'premenopausal': return '🌸';
    case 'postmenopausal': return '🌿';
    case 'current_patient': return '💜';
    case 'survivor': return '🎗️';
    default: return '💙';
  }
}

export default function HealthReport({ report }: HealthReportProps) {
  const healthScore = parseFloat(report.riskScore);
  const { summary, sectionAnalysis, personalizedPlan } = report.reportData;
  const uncontrollableScore = parseFloat(summary.uncontrollableHealthScore || "0");

  const navigateToChat = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                BH
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {report.userInfo?.firstName ? `${report.userInfo.firstName}'s` : 'Your'} Breast Health Report
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Comprehensive assessment and personalized recommendations
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Generated on {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={navigateToChat}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chat with AI
            </button>
            <button className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 rounded-xl font-semibold transition-all duration-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-gray-200 rounded-xl shadow-sm">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                {getProfileIcon(report.userProfile)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Health Score Overview</h2>
                <p className="text-gray-600">Comprehensive assessment of your breast health risk factors</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getUncontrollableRiskVariant(uncontrollableScore)}`}>
              {getUncontrollableHealthCategory(uncontrollableScore)}
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600 mb-3 font-medium">Controllable Health Score</div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl font-bold text-green-600">
                  {summary.totalHealthScore || summary.totalRiskScore}/100
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${healthScore}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Based on lifestyle factors you can control and modify
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600 mb-3 font-medium">Uncontrollable Health Score</div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl font-bold text-blue-600">
                  {summary.uncontrollableHealthScore || "N/A"}/100
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${summary.uncontrollableHealthScore || 0}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Based on demographics, genetics, and hormonal factors
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600 mb-3 font-medium">Your Profile</div>
              <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                {report.userProfile.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {summary.profileDescription}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section-Based Health Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Health Analysis by Section</h2>
          </div>
          <p className="text-gray-600 mt-2">Detailed breakdown of your health scores across different risk factor categories</p>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionAnalysis.sectionBreakdown.map((section, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{section.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeVariant(section.riskLevel)}`}>
                    {section.riskLevel.toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-indigo-600">
                      {section.score.toFixed(0)}/100
                    </div>
                    <div className="text-sm text-gray-500">
                      {section.factorCount} risk factor{section.factorCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${section.score}%` }}
                    ></div>
                  </div>
                </div>
                
                {section.riskFactors && section.riskFactors.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 mb-2">Risk Factors:</div>
                    {section.riskFactors.map((factor: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-600 font-medium">
                    ✅ No risk factors identified in this area
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Summaries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Detailed Section Analysis</h2>
          </div>
          <p className="text-gray-600 mt-2">Comprehensive analysis of each risk factor category with personalized insights</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-8">
            {Object.entries(sectionAnalysis.sectionSummaries).map(([sectionName, summary], index) => (
              <div key={sectionName} className="border-l-4 border-blue-300 pl-6 py-2">
                <h3 className="font-bold text-xl text-gray-900 mb-3">{sectionName}</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Coaching Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Personalized Coaching Plan</h2>
          </div>
          <p className="text-gray-600 mt-2">Tailored recommendations and focus areas based on your assessment results</p>
        </div>
        
        <div className="p-8">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-6">Primary Coaching Focus Areas</h3>
            <div className="grid gap-4">
              {(personalizedPlan.coachingFocus || []).map((focus, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1 leading-relaxed text-lg">{focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-6 4v10m-2-2h4"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Daily Wellness Plan</h2>
          </div>
          <p className="text-gray-600 mt-2">Structured daily activities and weekly goals to improve your breast health</p>
        </div>
        
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-green-600">🌅</span>
                Morning Routine
              </h4>
              <div className="text-gray-700 leading-relaxed">
                {report.dailyPlan.morning}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-blue-600">☀️</span>
                Afternoon Activities
              </h4>
              <div className="text-gray-700 leading-relaxed">
                {report.dailyPlan.afternoon}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-purple-600">🌙</span>
                Evening Routine
              </h4>
              <div className="text-gray-700 leading-relaxed">
                {report.dailyPlan.evening}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-8"></div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-orange-600">📅</span>
                Weekly Focus Areas
              </h4>
              <div className="space-y-3">
                {Object.entries(report.dailyPlan.weekly || {}).map(([key, value]) => (
                  <div key={key} className="text-gray-700 flex items-start gap-3">
                    <span className="text-orange-500 text-lg">•</span>
                    <div>
                      <span className="font-semibold capitalize">{key.replace('_', ' ')}:</span>
                      <span className="ml-2">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-emerald-600">💊</span>
                Recommended Supplements
              </h4>
              <div className="space-y-3">
                {(report.dailyPlan.supplements || []).map((supplement: string, index: number) => (
                  <div key={index} className="text-gray-700 flex items-start gap-3">
                    <span className="text-emerald-500 text-lg">•</span>
                    <span>{supplement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Follow-up Timeline</h2>
          </div>
          <p className="text-gray-600 mt-2">Structured timeline for monitoring progress and maintaining your health goals</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-4">
            {Object.entries(personalizedPlan.followUpTimeline || {}).map(([timeframe, action]) => (
              <div key={timeframe} className="flex items-start gap-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                <div className="text-sm font-bold text-indigo-700 whitespace-nowrap px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200">
                  {timeframe.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-gray-700 leading-relaxed text-lg">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}