import { useEffect, useState } from 'react';
import HealthReport from '../components/HealthReport';

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // Get quiz answers from localStorage
    const quizAnswers = JSON.parse(localStorage.getItem('brezcode_quiz_answers') || '{}');
    const userData = JSON.parse(localStorage.getItem('brezcode_user') || '{}');
    
    // Generate sample report based on quiz answers
    const sampleReport = {
      id: 1,
      riskScore: "78",
      riskCategory: "low" as const,
      userProfile: "premenopausal" as const,
      riskFactors: [
        "No family history of breast cancer",
        "Regular exercise routine",
        "Healthy BMI range",
        "No smoking history"
      ],
      recommendations: [
        "Continue regular exercise routine",
        "Maintain healthy diet",
        "Schedule annual mammograms starting at age 40",
        "Perform monthly self-examinations"
      ],
      dailyPlan: {
        morning: "Start with 5 minutes of breathing exercises, take vitamin D supplement, enjoy a nutritious breakfast rich in antioxidants",
        afternoon: "30-minute walk or moderate exercise, stay hydrated, include leafy greens in lunch",
        evening: "Light stretching or yoga, limit screen time before bed, herbal tea for relaxation",
        weekly: {
          exercise_goals: "150 minutes moderate activity or 75 minutes vigorous activity",
          nutrition_focus: "5-7 servings fruits and vegetables daily",
          stress_management: "Practice mindfulness or meditation 3x per week"
        },
        supplements: [
          "Vitamin D3 (1000-2000 IU daily)",
          "Omega-3 fatty acids (1000mg daily)",
          "Folate (400mcg daily)"
        ]
      },
      reportData: {
        summary: {
          totalRiskScore: "78",
          totalHealthScore: "78",
          uncontrollableHealthScore: "82",
          overallRiskCategory: "low",
          userProfile: "premenopausal",
          profileDescription: "Pre-menopausal women with healthy lifestyle factors and low genetic risk",
          totalSections: 6
        },
        sectionAnalysis: {
          sectionScores: {},
          sectionSummaries: {
            "Demographics": "Based on your age and ethnicity, you fall into a lower baseline risk category. Your demographic factors are favorable for breast health.",
            "Family History & Genetics": "No significant family history of breast or ovarian cancer. Consider genetic counseling if family history changes.",
            "Reproductive & Hormonal": "Your reproductive history and current hormonal status are within normal parameters. Continue monitoring any changes.",
            "Symptoms": "No current concerning symptoms reported. Continue monthly self-examinations and report any changes to your healthcare provider.",
            "Screening": "Regular screening is important. Discuss appropriate screening schedule with your healthcare provider based on risk factors.",
            "Lifestyle": "Excellent lifestyle factors including regular exercise, healthy diet, and no smoking. Continue these protective behaviors."
          },
          sectionBreakdown: [
            {
              name: "Demographics",
              score: 85,
              factorCount: 3,
              riskLevel: "low",
              riskFactors: []
            },
            {
              name: "Family History & Genetics",
              score: 90,
              factorCount: 0,
              riskLevel: "low",
              riskFactors: []
            },
            {
              name: "Reproductive & Hormonal",
              score: 75,
              factorCount: 1,
              riskLevel: "low",
              riskFactors: ["Early menarche (minor factor)"]
            },
            {
              name: "Symptoms",
              score: 95,
              factorCount: 0,
              riskLevel: "low",
              riskFactors: []
            },
            {
              name: "Screening",
              score: 80,
              factorCount: 0,
              riskLevel: "low",
              riskFactors: []
            },
            {
              name: "Lifestyle",
              score: 85,
              factorCount: 0,
              riskLevel: "low",
              riskFactors: []
            }
          ]
        },
        personalizedPlan: {
          dailyPlan: {},
          coachingFocus: [
            "Maintain current healthy lifestyle habits as they significantly reduce your breast cancer risk",
            "Establish a consistent screening routine appropriate for your age and risk factors",
            "Continue stress management practices as chronic stress can impact immune function",
            "Focus on maintaining healthy weight through balanced nutrition and regular exercise",
            "Stay informed about breast health and be proactive about any changes you notice"
          ],
          followUpTimeline: {
            "1_month": "Schedule routine check-up with primary care physician to discuss assessment results",
            "3_months": "Re-evaluate stress management techniques and their effectiveness",
            "6_months": "Review and update health goals, assess progress on lifestyle modifications",
            "1_year": "Complete follow-up assessment to track changes in risk factors and health status",
            "ongoing": "Continue monthly self-examinations and maintain healthy lifestyle practices"
          }
        }
      },
      createdAt: new Date().toISOString(),
      userInfo: {
        firstName: userData.firstName || 'User'
      }
    };

    setReport(sampleReport);
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Generating your personalized health report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <HealthReport report={report} />
    </div>
  );
}