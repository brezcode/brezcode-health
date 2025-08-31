import { useEffect, useState } from 'react';
import HealthReport from '../components/HealthReport';
import HealthScoreCard from '../components/HealthScoreCard';
import PersonalizedInsights from '../components/PersonalizedInsights';

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportFromDatabase = async () => {
      try {
        console.log('🏥 Fetching enhanced health report...');
        
        // Try the enhanced test endpoint first
        let response = await fetch('/api/insights/test');
        let result = await response.json();
        
        if (result.success && result.report) {
          console.log('✅ Enhanced health report loaded with insights');
          setReport(result.report);
          setError(null);
        } else {
          // Fallback to original endpoint
          console.log('🔄 Falling back to original report endpoint...');
          response = await fetch('/api/reports/latest');
          result = await response.json();
          
          if (result.success && result.report) {
            console.log('✅ Original health report loaded from database');
            setReport(result.report);
            setError(null);
          } else {
            console.error('❌ No report found in database:', result.error);
            setError('No health report found in database. Please complete the quiz first.');
          }
        }
        
      } catch (error) {
        console.error('❌ Database error:', error);
        setError('Unable to connect to database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReportFromDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your health report from database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Unable to Load Report</div>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Take Health Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No report data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Report</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Data from MongoDB Database</span>
          </div>
        </div>

        {/* Enhanced Dashboard Components */}
        <div className="space-y-6 mb-8">
          {/* Health Score Card */}
          {report.reportData?.summary && (
            <HealthScoreCard 
              score={parseInt(report.reportData.summary.totalHealthScore) || 50}
              riskCategory={report.riskCategory || 'moderate'}
              improvementPotential={report.insights?.improvement_potential}
            />
          )}

          {/* Personalized Insights */}
          {report.insights && (
            <PersonalizedInsights insights={report.insights} />
          )}
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Health?</h2>
          <p className="text-lg mb-6 opacity-90">
            Get your personalized plan with expert guidance, daily tips, and proven strategies.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button className="w-full md:w-auto bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              🚀 Get My Personalized Plan - $197/month
            </button>
            <button className="w-full md:w-auto border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              📞 Talk to a Health Coach - Free 15min
            </button>
          </div>
          <div className="mt-4 text-sm opacity-75">
            90-day money-back guarantee • Cancel anytime
          </div>
        </div>
        
        {/* Original Detailed Report */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Health Analysis</h3>
          <HealthReport report={report} />
        </div>
      </div>
    </div>
  );
}