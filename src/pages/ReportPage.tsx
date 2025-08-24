import { useEffect, useState } from 'react';
import HealthReport from '../components/HealthReport';

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // Get quiz answers from localStorage
    const quizAnswers = JSON.parse(localStorage.getItem('brezcode_quiz_answers') || '{}');
    const userData = JSON.parse(localStorage.getItem('brezcode_user') || '{}');
    
    // Calculate comprehensive scores based on quiz answers
    const calculateSectionScore = (sectionName: string, answers: any) => {
      let score = 100;
      let riskFactors: string[] = [];
      let factorCount = 0;

      switch (sectionName) {
        case "Demographics":
          if (answers.age && answers.age > 50) {
            score -= 15;
            riskFactors.push("Age over 50 (increased risk)");
            factorCount++;
          }
          if (answers.ethnicity === "Black") {
            score -= 10;
            riskFactors.push("Black ethnicity (higher baseline risk)");
            factorCount++;
          }
          if (answers.country === "United States") {
            score -= 5;
            riskFactors.push("US residence (higher incidence)");
            factorCount++;
          }
          break;

        case "Family History & Genetics":
          if (answers.family_history === "Yes") {
            score -= 25;
            riskFactors.push("Family history of breast cancer");
            factorCount++;
          }
          if (answers.genetic_mutation === "Yes") {
            score -= 30;
            riskFactors.push("Genetic mutation (BRCA1/BRCA2)");
            factorCount++;
          }
          if (answers.ovarian_cancer === "Yes") {
            score -= 20;
            riskFactors.push("Family history of ovarian cancer");
            factorCount++;
          }
          break;

        case "Reproductive & Hormonal":
          if (answers.menarche && answers.menarche < 12) {
            score -= 10;
            riskFactors.push("Early menarche (before age 12)");
            factorCount++;
          }
          if (answers.menopause && answers.menopause > 55) {
            score -= 10;
            riskFactors.push("Late menopause (after age 55)");
            factorCount++;
          }
          if (answers.hrt === "Yes") {
            score -= 15;
            riskFactors.push("Combined HRT use >5 years");
            factorCount++;
          }
          if (answers.first_child && answers.first_child > 30) {
            score -= 10;
            riskFactors.push("First child after age 30");
            factorCount++;
          }
          break;

        case "Symptoms":
          if (answers.breast_symptoms && answers.breast_symptoms !== "No, I don't have any symptoms") {
            score -= 20;
            if (answers.breast_symptoms === "I have a lump in my breast") {
              riskFactors.push("Breast lump detected");
            } else if (answers.breast_symptoms === "I have breast pain") {
              riskFactors.push("Breast pain reported");
            } else if (answers.breast_symptoms === "I have swollen breast or changed in size or shape") {
              riskFactors.push("Breast size/shape changes");
            }
            factorCount++;
          }
          break;

        case "Screening":
          if (answers.mammogram === "Never") {
            score -= 15;
            riskFactors.push("No previous mammograms");
            factorCount++;
          }
          if (answers.self_exam === "Never") {
            score -= 10;
            riskFactors.push("No self-examination routine");
            factorCount++;
          }
          break;

        case "Lifestyle":
          if (answers.bmi && answers.bmi > 25) {
            score -= 10;
            riskFactors.push("BMI above healthy range");
            factorCount++;
          }
          if (answers.smoking === "Yes") {
            score -= 15;
            riskFactors.push("Current or former smoker");
            factorCount++;
          }
          if (answers.alcohol === "Yes") {
            score -= 10;
            riskFactors.push("Regular alcohol consumption");
            factorCount++;
          }
          if (answers.exercise === "No, little or no regular exercise") {
            score -= 15;
            riskFactors.push("Sedentary lifestyle");
            factorCount++;
          }
          if (answers.stress === "Yes, chronic high stress") {
            score -= 10;
            riskFactors.push("Chronic high stress");
            factorCount++;
          }
          if (answers.sugar_diet === "Yes, high sugar diet") {
            score -= 10;
            riskFactors.push("High sugar diet");
            factorCount++;
          }
          break;
      }

      return {
        score: Math.max(score, 0),
        riskFactors,
        factorCount
      };
    };

    // Generate comprehensive section analysis
    const sections = [
      "Demographics",
      "Family History & Genetics", 
      "Reproductive & Hormonal",
      "Symptoms",
      "Screening",
      "Lifestyle"
    ];

    const sectionBreakdown = sections.map(sectionName => {
      const result = calculateSectionScore(sectionName, quizAnswers);
      let riskLevel = "low";
      if (result.score < 60) riskLevel = "high";
      else if (result.score < 80) riskLevel = "moderate";
      
      return {
        name: sectionName,
        score: result.score,
        factorCount: result.factorCount,
        riskLevel,
        riskFactors: result.riskFactors
      };
    });

    // Calculate overall scores
    const totalScore = Math.round(sectionBreakdown.reduce((sum, section) => sum + section.score, 0) / sections.length);
    const uncontrollableScore = Math.round(
      (sectionBreakdown.find(s => s.name === "Demographics")?.score || 100) +
      (sectionBreakdown.find(s => s.name === "Family History & Genetics")?.score || 100) +
      (sectionBreakdown.find(s => s.name === "Reproductive & Hormonal")?.score || 100)
    ) / 3;

    // Determine risk category
    let riskCategory: 'low' | 'moderate' | 'high' = 'low';
    if (totalScore < 60) riskCategory = 'high';
    else if (totalScore < 80) riskCategory = 'moderate';

    // Determine user profile
    let userProfile: 'teenager' | 'premenopausal' | 'postmenopausal' | 'current_patient' | 'survivor' = 'premenopausal';
    if (quizAnswers.age < 20) userProfile = 'teenager';
    else if (quizAnswers.age > 55) userProfile = 'postmenopausal';

    // Generate comprehensive report
    const sampleReport = {
      id: 1,
      riskScore: totalScore.toString(),
      riskCategory,
      userProfile,
      riskFactors: sectionBreakdown.flatMap(section => section.riskFactors),
      recommendations: generateRecommendations(riskCategory, sectionBreakdown),
      dailyPlan: generateDailyPlan(riskCategory, sectionBreakdown),
      reportData: {
        summary: {
          totalRiskScore: totalScore.toString(),
          totalHealthScore: totalScore.toString(),
          uncontrollableHealthScore: uncontrollableScore.toString(),
          overallRiskCategory: riskCategory,
          userProfile,
          profileDescription: generateProfileDescription(userProfile, riskCategory),
          totalSections: sections.length
        },
        sectionAnalysis: {
          sectionScores: Object.fromEntries(
            sectionBreakdown.map(section => [
              section.name, 
              { score: section.score, factors: section.riskFactors }
            ])
          ),
          sectionSummaries: generateSectionSummaries(sectionBreakdown, quizAnswers),
          sectionBreakdown
        },
        personalizedPlan: {
          dailyPlan: generateDailyPlan(riskCategory, sectionBreakdown),
          coachingFocus: generateCoachingFocus(riskCategory, sectionBreakdown),
          followUpTimeline: generateFollowUpTimeline(riskCategory)
        }
      },
      createdAt: new Date().toISOString(),
      userInfo: {
        firstName: userData.firstName || 'User'
      }
    };

    setReport(sampleReport);
  }, []);

  // Helper functions
  function generateRecommendations(riskCategory: string, sectionBreakdown: any[]) {
    const baseRecommendations = [
      "Schedule annual check-ups with your healthcare provider",
      "Perform monthly self-examinations",
      "Maintain a healthy lifestyle with regular exercise"
    ];

    if (riskCategory === 'high') {
      return [
        "Immediate consultation with breast health specialist",
        "Consider genetic counseling and testing",
        "More frequent screening as recommended by your doctor",
        "Lifestyle modifications to reduce risk factors",
        ...baseRecommendations
      ];
    } else if (riskCategory === 'moderate') {
      return [
        "Regular screening every 6-12 months",
        "Focus on modifiable risk factors",
        "Consider preventive measures",
        ...baseRecommendations
      ];
    } else {
      return [
        "Continue current healthy practices",
        "Annual mammograms starting at age 40",
        "Regular self-examinations",
        ...baseRecommendations
      ];
    }
  }

  function generateDailyPlan(riskCategory: string, sectionBreakdown: any[]) {
    const lifestyleSection = sectionBreakdown.find(s => s.name === "Lifestyle");
    const hasExercise = lifestyleSection && lifestyleSection.score > 70;
    const hasStress = lifestyleSection && lifestyleSection.riskFactors.some(f => f.includes("stress"));

    return {
      morning: riskCategory === 'high' 
        ? "Start with 10 minutes of meditation, take recommended supplements, enjoy antioxidant-rich breakfast with berries and green tea"
        : "Start with 5 minutes of breathing exercises, take vitamin D supplement, enjoy a nutritious breakfast rich in antioxidants",
      afternoon: hasExercise 
        ? "45-minute moderate exercise session, stay hydrated, include leafy greens and lean protein in lunch"
        : "30-minute walk or moderate exercise, stay hydrated, include leafy greens in lunch",
      evening: hasStress
        ? "Light stretching or yoga, practice stress-reduction techniques, herbal tea for relaxation, limit screen time"
        : "Light stretching or yoga, limit screen time before bed, herbal tea for relaxation",
      weekly: {
        exercise_goals: riskCategory === 'high' 
          ? "200 minutes moderate activity or 100 minutes vigorous activity"
          : "150 minutes moderate activity or 75 minutes vigorous activity",
        nutrition_focus: "5-7 servings fruits and vegetables daily, limit processed foods",
        stress_management: hasStress 
          ? "Practice mindfulness or meditation 5x per week"
          : "Practice mindfulness or meditation 3x per week"
      },
      supplements: riskCategory === 'high' 
        ? [
            "Vitamin D3 (2000-4000 IU daily)",
            "Omega-3 fatty acids (2000mg daily)",
            "Folate (800mcg daily)",
            "Curcumin (500mg daily)",
            "Green tea extract (500mg daily)"
          ]
        : [
            "Vitamin D3 (1000-2000 IU daily)",
            "Omega-3 fatty acids (1000mg daily)",
            "Folate (400mcg daily)"
          ]
    };
  }

  function generateProfileDescription(userProfile: string, riskCategory: string) {
    const descriptions = {
      teenager: "Young women with developing breast tissue. Focus on establishing healthy habits early.",
      premenopausal: "Women of reproductive age. Regular monitoring and healthy lifestyle are key.",
      postmenopausal: "Women past reproductive age. Hormonal changes require increased vigilance.",
      current_patient: "Individuals currently undergoing treatment. Specialized care and support needed.",
      survivor: "Breast cancer survivors. Ongoing monitoring and risk reduction strategies."
    };
    
    return descriptions[userProfile as keyof typeof descriptions] || "Individual with personalized risk profile.";
  }

  function generateSectionSummaries(sectionBreakdown: any[], quizAnswers: any) {
    const summaries: { [key: string]: string } = {};
    
    sectionBreakdown.forEach(section => {
      switch (section.name) {
        case "Demographics":
          if (section.score >= 80) {
            summaries[section.name] = "Your demographic factors are favorable for breast health. Age and ethnicity place you in a lower baseline risk category.";
          } else if (section.score >= 60) {
            summaries[section.name] = "Some demographic factors may slightly increase your baseline risk. Regular monitoring is recommended.";
          } else {
            summaries[section.name] = "Your demographic profile indicates higher baseline risk. More frequent screening and preventive measures are important.";
          }
          break;

        case "Family History & Genetics":
          if (section.score >= 80) {
            summaries[section.name] = "No significant family history of breast or ovarian cancer identified. Your genetic risk appears low.";
          } else if (section.score >= 60) {
            summaries[section.name] = "Some family history factors may increase your risk. Consider genetic counseling for personalized assessment.";
          } else {
            summaries[section.name] = "Significant family history or genetic factors identified. Genetic counseling and specialized screening are strongly recommended.";
          }
          break;

        case "Reproductive & Hormonal":
          if (section.score >= 80) {
            summaries[section.name] = "Your reproductive history and hormonal factors are within normal parameters. Continue monitoring any changes.";
          } else if (section.score >= 60) {
            summaries[section.name] = "Some reproductive factors may influence your risk. Regular monitoring and lifestyle modifications can help.";
          } else {
            summaries[section.name] = "Several reproductive and hormonal factors increase your risk. Consult with your healthcare provider about preventive strategies.";
          }
          break;

        case "Symptoms":
          if (section.score >= 80) {
            summaries[section.name] = "No current concerning symptoms reported. Continue monthly self-examinations and report any changes promptly.";
          } else {
            summaries[section.name] = "Some symptoms require attention. Immediate consultation with a healthcare provider is recommended for proper evaluation.";
          }
          break;

        case "Screening":
          if (section.score >= 80) {
            summaries[section.name] = "Good screening practices in place. Continue regular mammograms and self-examinations as recommended.";
          } else if (section.score >= 60) {
            summaries[section.name] = "Some screening gaps identified. Establish regular screening routine with your healthcare provider.";
          } else {
            summaries[section.name] = "Screening improvements needed. Immediate consultation to establish appropriate screening schedule.";
          }
          break;

        case "Lifestyle":
          if (section.score >= 80) {
            summaries[section.name] = "Excellent lifestyle factors including regular exercise, healthy diet, and stress management. Continue these protective behaviors.";
          } else if (section.score >= 60) {
            summaries[section.name] = "Some lifestyle factors could be improved. Focus on modifiable risk factors to reduce your overall risk.";
          } else {
            summaries[section.name] = "Several lifestyle factors need attention. Significant improvements in diet, exercise, and stress management can substantially reduce your risk.";
          }
          break;
      }
    });

    return summaries;
  }

  function generateCoachingFocus(riskCategory: string, sectionBreakdown: any[]) {
    const focus: string[] = [];
    
    if (riskCategory === 'high') {
      focus.push("Immediate risk reduction strategies and medical consultation");
      focus.push("Genetic counseling and specialized screening protocols");
      focus.push("Comprehensive lifestyle modifications");
    } else if (riskCategory === 'moderate') {
      focus.push("Targeted risk factor reduction");
      focus.push("Enhanced screening and monitoring");
      focus.push("Preventive lifestyle improvements");
    } else {
      focus.push("Maintain current healthy practices");
      focus.push("Establish consistent screening routine");
      focus.push("Continue preventive lifestyle habits");
    }

    // Add section-specific focus areas
    sectionBreakdown.forEach(section => {
      if (section.score < 70) {
        focus.push(`Improve ${section.name.toLowerCase()} factors`);
      }
    });

    return focus.slice(0, 5); // Limit to top 5 focus areas
  }

  function generateFollowUpTimeline(riskCategory: string) {
    if (riskCategory === 'high') {
      return {
        "1_week": "Schedule immediate consultation with breast health specialist",
        "1_month": "Complete recommended diagnostic tests and genetic counseling",
        "3_months": "Follow-up with specialist and establish monitoring protocol",
        "6_months": "Re-evaluate risk factors and adjust prevention strategies",
        "ongoing": "Regular monitoring and lifestyle maintenance"
      };
    } else if (riskCategory === 'moderate') {
      return {
        "1_month": "Schedule consultation with primary care physician",
        "3_months": "Complete recommended screening and establish routine",
        "6_months": "Re-evaluate risk factors and prevention strategies",
        "1_year": "Annual comprehensive assessment",
        "ongoing": "Regular screening and lifestyle maintenance"
      };
    } else {
      return {
        "1_month": "Schedule routine check-up to discuss assessment results",
        "3_months": "Re-evaluate stress management and lifestyle goals",
        "6_months": "Review health goals and assess progress",
        "1_year": "Complete follow-up assessment",
        "ongoing": "Continue monthly self-examinations and healthy practices"
      };
    }
  }

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