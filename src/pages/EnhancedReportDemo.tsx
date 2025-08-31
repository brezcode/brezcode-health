import React from 'react';
import HealthScoreCard from '../components/HealthScoreCard';
import PersonalizedInsights from '../components/PersonalizedInsights';

// Mock data for demonstration
const mockReport = {
  riskScore: "68",
  riskCategory: "high",
  reportData: {
    summary: {
      totalHealthScore: "42",
      controllableHealthScore: "35",
      uncontrollableHealthScore: "65"
    }
  },
  insights: {
    evidence_badges: [
      {
        code: "FAMILY_HISTORY",
        label: "Family history increases your risk",
        evidence_text: "Large studies show family history doubles your chances of breast health issues",
        source: "Studies following 50,302 women across 30 countries",
        strength: "Strong evidence",
        what_it_means: "Your genetics play a role, but lifestyle choices still matter most",
        hope_message: "You can take steps your family members didn't know about"
      },
      {
        code: "LOW_EXERCISE",
        label: "Not getting enough exercise raises risk",
        evidence_text: "Women who walk 150 minutes per week reduce their risk by 20-25%",
        source: "Meta-analysis of 47 studies worldwide",
        strength: "Strong evidence",
        what_it_means: "Your body needs movement to stay healthy and fight disease",
        hope_message: "Even 20 minutes of walking 3 times a week makes a difference"
      },
      {
        code: "ALCOHOL_HIGH",
        label: "Drinking alcohol increases risk",
        evidence_text: "Each daily drink increases breast cancer risk by 7-10%",
        source: "Research following 1.2 million women",
        strength: "Strong evidence",
        what_it_means: "Alcohol affects hormones and damages cells over time",
        hope_message: "Cutting back to 3-4 drinks per week significantly reduces risk"
      }
    ],
    pain_points: [
      {
        code: "LOW_EXERCISE",
        pain: "I don't have time for long workouts",
        micro_action: "Take a 10-minute walk during lunch break",
        talk_track: "Even small amounts of movement add up to big health benefits",
        expert_video: {
          title: "The Power of 10-Minute Movement",
          expert: "Dr. Kerry Courneya",
          url: "https://youtube.com/watch?v=example1",
          duration: "12:30"
        }
      },
      {
        code: "ALCOHOL_HIGH",
        pain: "I use wine to relax after stressful days",
        micro_action: "Replace one drink per week with herbal tea",
        talk_track: "Finding new ways to unwind protects your health without sacrificing relaxation",
        expert_video: {
          title: "Healthy Ways to Manage Stress",
          expert: "Dr. Sara Lazar",
          url: "https://youtube.com/watch?v=example2",
          duration: "16:45"
        }
      }
    ],
    urgency: {
      has_urgent_issues: true,
      urgency_score: 75,
      overdue_months: 18,
      primary_concern: "Schedule your overdue screening",
      timeline_message: "Consider scheduling health appointments soon",
      next_7_days: [
        {
          day: "Today",
          action: "Take a 10-minute walk",
          points: "+2",
          difficulty: "Easy"
        },
        {
          day: "Tomorrow",
          action: "Add berries to breakfast",
          points: "+1",
          difficulty: "Easy"
        },
        {
          day: "This week",
          action: "Call to schedule mammogram",
          points: "+5",
          difficulty: "Important"
        }
      ]
    },
    improvement_potential: {
      total_potential: 28,
      message: "Significant improvement possible",
      improvements: [
        {
          area: "Exercise",
          potential: "+15 points",
          action: "Start walking 150 minutes per week",
          timeframe: "3-6 months"
        },
        {
          area: "Nutrition",
          potential: "+12 points",
          action: "Switch to Mediterranean-style eating",
          timeframe: "2-4 months"
        },
        {
          area: "Alcohol Reduction",
          potential: "+8 points",
          action: "Reduce to 3-4 drinks per week",
          timeframe: "1-2 months"
        }
      ]
    },
    expert_videos: [
      {
        expert: "Dr. David Katz",
        title: "The Truth About Food and Disease Prevention",
        video_url: "https://www.youtube.com/watch?v=example1",
        ted_talk: true,
        duration: "18:30"
      }
    ],
    daily_tips: [
      { tip: "Drink green tea instead of coffee today", category: "nutrition" },
      { tip: "Take the stairs instead of the elevator", category: "exercise" },
      { tip: "Practice deep breathing for 3 minutes", category: "stress" }
    ]
  }
};

export default function EnhancedReportDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Health Dashboard - DEMO</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Preview of Enhanced Features</span>
          </div>
        </div>

        {/* Enhanced Dashboard Components */}
        <div className="space-y-6 mb-8">
          {/* Health Score Card */}
          <HealthScoreCard 
            score={parseInt(mockReport.reportData.summary.totalHealthScore)}
            riskCategory={mockReport.riskCategory}
            improvementPotential={mockReport.insights.improvement_potential}
          />

          {/* Personalized Insights */}
          <PersonalizedInsights insights={mockReport.insights} />
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

        {/* Feature Highlights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">✨ New Enhanced Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Visual health score with improvement potential</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Evidence-based insights with research citations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Pain point solutions with expert videos</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Quick wins for immediate action</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Gentle urgency without fear tactics</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Compelling conversion-optimized CTAs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}