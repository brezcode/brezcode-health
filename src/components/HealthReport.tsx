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
    case 'low': return 'bg-green-100 text-green-800';          
    case 'moderate': return 'bg-blue-100 text-blue-800';   
    case 'high': return 'bg-gray-100 text-gray-800';         
    case 'very_high': return 'bg-red-100 text-red-800'; 
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getUncontrollableHealthCategory(score: number): string {
  if (score >= 80) return 'Low Risk';       
  if (score >= 65) return 'Moderate Risk';  
  if (score >= 50) return 'High Risk';      
  return 'Very High Risk';                        
}

function getUncontrollableRiskVariant(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';       
  if (score >= 65) return 'bg-blue-100 text-blue-800';     
  if (score >= 50) return 'bg-gray-100 text-gray-800';       
  return 'bg-red-100 text-red-800';                    
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
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {report.userInfo?.firstName ? `${report.userInfo.firstName}'s` : 'Your'} Breast Health Report
          </h1>
          <p className="text-gray-600 mt-1">
            Generated on {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={navigateToChat}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chat with AI
          </button>
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 border rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getProfileIcon(report.userProfile)}</span>
              <span className="text-xl font-bold">Your Health Score</span>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${getUncontrollableRiskVariant(uncontrollableScore)}`}>
              {getUncontrollableHealthCategory(uncontrollableScore).toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Controllable Health Score</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-600">
                  {summary.totalHealthScore || summary.totalRiskScore}/100
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Higher scores mean better health! Based on Symptom and Lifestyle factors you can control.
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Uncontrollable Health Score</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">
                  {summary.uncontrollableHealthScore || "N/A"}/100
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${summary.uncontrollableHealthScore || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Based on Demographics, Genetics, Hormonal factors and Screening results.
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Your Profile</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {report.userProfile.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {summary.profileDescription}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section-Based Health Analysis */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h2 className="text-xl font-bold">Health Analysis by Section</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sectionAnalysis.sectionBreakdown.map((section, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900">{section.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskBadgeVariant(section.riskLevel)}`}>
                    {section.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-lg font-bold text-indigo-600">
                    {section.score.toFixed(0)}/100
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${section.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {section.riskFactors && section.riskFactors.length > 0 ? (
                  <div className="space-y-1">
                    {section.riskFactors.map((factor: string, idx: number) => (
                      <p key={idx} className="text-xs text-gray-600 leading-tight">
                        • {factor}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-green-600">
                    No risk factors identified in this area
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Summaries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <h2 className="text-xl font-bold">Detailed Section Analysis</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {Object.entries(sectionAnalysis.sectionSummaries).map(([sectionName, summary]) => (
            <div key={sectionName} className="border-l-4 border-blue-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">{sectionName}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Coaching Plan */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <h2 className="text-xl font-bold">Your Personalized Coaching Plan</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Primary Coaching Focus Areas</h3>
            <div className="grid gap-3">
              {(personalizedPlan.coachingFocus || []).map((focus, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Plan */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-6 4v10m-2-2h4"></path>
            </svg>
            <h2 className="text-xl font-bold">Your Daily Wellness Plan</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Morning</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.morning}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Afternoon</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.afternoon}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Evening</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.evening}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Weekly Focus</h4>
              <div className="space-y-2">
                {Object.entries(report.dailyPlan.weekly || {}).map(([key, value]) => (
                  <div key={key} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Supplements</h4>
              <div className="space-y-2">
                {(report.dailyPlan.supplements || []).map((supplement: string, index: number) => (
                  <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {supplement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Timeline */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Follow-up Timeline</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(personalizedPlan.followUpTimeline || {}).map(([timeframe, action]) => (
              <div key={timeframe} className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg">
                <div className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                  {timeframe.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-sm text-gray-700">{action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}