import { useEffect, useState } from 'react';
import HealthReport from '../components/HealthReport';

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportFromDatabase = async () => {
      try {
        console.log('🏥 Fetching latest health report directly from MongoDB...');
        
        const response = await fetch('/api/reports/latest');
        const result = await response.json();
        
        if (result.success && result.report) {
          console.log('✅ Health report loaded directly from MongoDB database');
          setReport(result.report);
          setError(null);
        } else {
          console.error('❌ No report found in database:', result.error);
          setError('No health report found in database. Please complete the quiz first.');
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
        
        <HealthReport report={report} />
      </div>
    </div>
  );
}