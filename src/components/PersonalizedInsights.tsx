import React, { useState } from 'react';
import { AlertCircle, Clock, TrendingUp, Play, Info, Heart } from 'lucide-react';

interface Evidence {
  code: string;
  label: string;
  evidence_text: string;
  source: string;
  strength: string;
  what_it_means: string;
  hope_message: string;
}

interface PainPoint {
  code: string;
  pain: string;
  micro_action: string;
  talk_track: string;
  expert_video?: {
    title: string;
    expert: string;
    url: string;
    duration: string;
  };
}

interface UrgencyData {
  has_urgent_issues: boolean;
  urgency_score: number;
  overdue_months: number;
  primary_concern: string;
  timeline_message: string;
  next_7_days: Array<{
    day: string;
    action: string;
    points: string;
    difficulty: string;
  }>;
}

interface InsightsProps {
  insights: {
    evidence_badges: Evidence[];
    pain_points: PainPoint[];
    urgency: UrgencyData;
    expert_videos: any[];
    daily_tips: Array<{ tip: string; category: string }>;
  };
}

export default function PersonalizedInsights({ insights }: InsightsProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState<string | null>(null);

  const { evidence_badges, pain_points, urgency, expert_videos, daily_tips } = insights;

  const getUrgencyColor = (urgencyScore: number) => {
    if (urgencyScore > 70) return 'bg-red-50 border-red-200 text-red-800';
    if (urgencyScore > 40) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const getStrengthBadge = (strength: string) => {
    const colors = {
      'Strong evidence': 'bg-green-100 text-green-800',
      'Good evidence': 'bg-blue-100 text-blue-800',
      'Moderate evidence': 'bg-yellow-100 text-yellow-800',
    };
    return colors[strength as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Urgency Banner */}
      {urgency.has_urgent_issues && (
        <div className={`p-4 rounded-lg border ${getUrgencyColor(urgency.urgency_score)}`}>
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{urgency.primary_concern}</h3>
              <p className="mb-3">{urgency.timeline_message}</p>
              
              {urgency.overdue_months > 0 && (
                <div className="bg-white bg-opacity-50 p-3 rounded border mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      Overdue by {urgency.overdue_months} months
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    Regular screening is your best defense against serious health issues.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Wins - Next 7 Days */}
      {urgency.next_7_days && urgency.next_7_days.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Your Quick Wins (This Week)</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Start with these simple actions to begin improving your health score:
          </p>
          
          <div className="space-y-3">
            {urgency.next_7_days.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{action.action}</div>
                  <div className="text-sm text-gray-600">{action.day} • {action.difficulty}</div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{action.points}</span>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Badges */}
      {evidence_badges && evidence_badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What the Research Shows About Your Risk Factors
          </h3>
          
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {evidence_badges.slice(0, 3).map((evidence, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEvidence(evidence)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{evidence.label}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStrengthBadge(evidence.strength)}`}>
                    {evidence.strength}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{evidence.evidence_text}</p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Info className="w-3 h-3 mr-1" />
                  Click to learn more
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points with Solutions */}
      {pain_points && pain_points.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Let's Address Your Challenges
          </h3>
          <p className="text-gray-600 mb-4">
            We understand these common struggles. Here are simple first steps:
          </p>
          
          <div className="space-y-4">
            {pain_points.slice(0, 2).map((painPoint, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Heart className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-2">
                      "{painPoint.pain}"
                    </div>
                    
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="font-medium text-sm text-gray-900 mb-1">Try This:</div>
                      <div className="text-sm text-gray-700">{painPoint.micro_action}</div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{painPoint.talk_track}</p>
                    
                    {painPoint.expert_video && (
                      <button
                        onClick={() => setShowVideoPlayer(painPoint.expert_video!.url)}
                        className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Watch: {painPoint.expert_video.title} ({painPoint.expert_video.duration})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tips */}
      {daily_tips && daily_tips.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Health Tips</h3>
          
          <div className="grid gap-3">
            {daily_tips.slice(0, 3).map((tip, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-gray-900">{tip.tip}</span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">({tip.category})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedEvidence.label}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">The Research:</h4>
                <p className="text-gray-700">{selectedEvidence.evidence_text}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What This Means for You:</h4>
                <p className="text-gray-700">{selectedEvidence.what_it_means}</p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">The Good News:</h4>
                <p className="text-green-700">{selectedEvidence.hope_message}</p>
              </div>
              
              <div className="text-xs text-gray-500">
                Source: {selectedEvidence.source}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedEvidence(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Expert Video</h3>
              <button
                onClick={() => setShowVideoPlayer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Video player would be embedded here<br />
                URL: {showVideoPlayer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}