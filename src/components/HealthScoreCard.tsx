import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  riskCategory: string;
  improvementPotential?: {
    total_potential: number;
    message: string;
    improvements: Array<{
      area: string;
      potential: string;
      action: string;
      timeframe: string;
    }>;
  };
}

const getRiskColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getRiskIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'low': return <CheckCircle className="w-5 h-5" />;
    case 'moderate': return <AlertTriangle className="w-5 h-5" />;
    case 'high': return <AlertTriangle className="w-5 h-5" />;
    default: return <AlertTriangle className="w-5 h-5" />;
  }
};

const getScoreMessage = (score: number, category: string) => {
  if (category.toLowerCase() === 'high') {
    return `You scored higher risk than ${Math.round(100 - score)}% of women your age, but this can be improved!`;
  }
  if (category.toLowerCase() === 'moderate') {
    return `Your risk level is moderate. There are opportunities to improve your score.`;
  }
  return `Your risk level looks good! Keep up the healthy habits.`;
};

export default function HealthScoreCard({ score, riskCategory, improvementPotential }: HealthScoreProps) {
  const scorePercentage = score;
  const riskColorClass = getRiskColor(riskCategory);
  const riskIcon = getRiskIcon(riskCategory);
  const scoreMessage = getScoreMessage(score, riskCategory);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Breast Health Score</h2>
        
        {/* Score Display */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            <path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke={riskCategory.toLowerCase() === 'high' ? '#ef4444' : 
                     riskCategory.toLowerCase() === 'moderate' ? '#f59e0b' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={`${scorePercentage}, 100`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{score}</div>
              <div className="text-xs text-gray-500">out of 100</div>
            </div>
          </div>
        </div>

        {/* Risk Category Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${riskColorClass} mb-3`}>
          {riskIcon}
          <span className="ml-2 capitalize">{riskCategory} Risk Category</span>
        </div>

        {/* Score Message */}
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          {scoreMessage}
        </p>
      </div>

      {/* Improvement Potential */}
      {improvementPotential && improvementPotential.total_potential > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Your Improvement Potential</h3>
            </div>
            
            {/* Before/After Visualization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Score:</span>
                <span className="text-lg font-semibold text-gray-900">{score}/100</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${score}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Potential Score:</span>
                <span className="text-lg font-semibold text-green-600">
                  {Math.min(score + improvementPotential.total_potential, 100)}/100
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000 delay-500"
                  style={{ width: `${Math.min(score + improvementPotential.total_potential, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-2xl font-bold text-green-600">
                +{improvementPotential.total_potential} points
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {improvementPotential.message}
              </p>
            </div>
          </div>

          {/* Top Improvement Areas */}
          <div className="space-y-3">
            {improvementPotential.improvements.slice(0, 3).map((improvement, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{improvement.area}</div>
                  <div className="text-sm text-gray-600">{improvement.action}</div>
                  <div className="text-xs text-gray-500">{improvement.timeframe}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{improvement.potential}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}