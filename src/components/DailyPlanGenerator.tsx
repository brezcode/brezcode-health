import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Calendar,
  Clock,
  Heart,
  Apple,
  Activity,
  Brain,
  CheckCircle,
  Circle,
  Star,
  Target
} from 'lucide-react';

interface UserProfile {
  age: number;
  lifeStage: 'teen' | 'reproductive' | 'menopause' | 'senior';
  riskLevel: 'low' | 'moderate' | 'high';
  preferences: {
    exerciseType: string[];
    dietaryRestrictions: string[];
    availableTime: string;
  };
}

interface DailyActivity {
  id: string;
  title: string;
  description: string;
  category: 'self-care' | 'nutrition' | 'movement' | 'mindfulness';
  timeRequired: string;
  points: number;
  completed: boolean;
  evidenceBased: string;
  icon: React.ReactNode;
}

interface DailyPlan {
  date: string;
  morning: DailyActivity[];
  afternoon: DailyActivity[];
  evening: DailyActivity[];
  totalPoints: number;
  completedPoints: number;
}

interface Props {
  userProfile: UserProfile;
  onActivityComplete: (activityId: string, completed: boolean) => void;
}

export default function DailyPlanGenerator({ userProfile, onActivityComplete }: Props) {
  const [todaysPlan, setTodaysPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate personalized daily plan based on user profile
  useEffect(() => {
    const generateDailyPlan = (): DailyPlan => {
      const today = new Date().toDateString();
      
      // Base activities for all users
      const baseActivities: Omit<DailyActivity, 'id' | 'completed'>[] = [
        // Morning Activities
        {
          title: "5-Minute Breast Massage",
          description: "Gentle circular massage with therapy cream",
          category: "self-care",
          timeRequired: "5 min",
          points: 10,
          evidenceBased: "Improves circulation and early detection",
          icon: <Heart className="h-4 w-4" />
        },
        {
          title: "Mediterranean Breakfast",
          description: "Greek yogurt with berries and walnuts",
          category: "nutrition", 
          timeRequired: "10 min",
          points: 8,
          evidenceBased: "15-20% risk reduction from Mediterranean diet",
          icon: <Apple className="h-4 w-4" />
        },
        {
          title: "Morning Meditation",
          description: "10-minute MBSR mindfulness practice",
          category: "mindfulness",
          timeRequired: "10 min",
          points: 10,
          evidenceBased: "25% cortisol reduction, immune boost",
          icon: <Brain className="h-4 w-4" />
        },

        // Afternoon Activities  
        {
          title: "Brisk Walking",
          description: "30-minute walk outdoors or treadmill",
          category: "movement",
          timeRequired: "30 min", 
          points: 15,
          evidenceBased: "20-30% risk reduction from 150min/week",
          icon: <Activity className="h-4 w-4" />
        },
        {
          title: "Green Tea Break",
          description: "2-3 cups of green tea throughout day",
          category: "nutrition",
          timeRequired: "5 min",
          points: 5,
          evidenceBased: "10% risk reduction from EGCG antioxidants",
          icon: <Apple className="h-4 w-4" />
        },

        // Evening Activities
        {
          title: "Supplement Check",
          description: "Vitamin D (2000 IU) + Omega-3 (2g)",
          category: "nutrition",
          timeRequired: "2 min",
          points: 8,
          evidenceBased: "20% risk reduction (Vitamin D), 14% (Omega-3)",
          icon: <Apple className="h-4 w-4" />
        },
        {
          title: "4-7-8 Breathing",
          description: "Stress-relief breathing before bed",
          category: "mindfulness",
          timeRequired: "5 min",
          points: 5,
          evidenceBased: "Activates relaxation response, lowers stress hormones",
          icon: <Brain className="h-4 w-4" />
        }
      ];

      // Customize activities based on life stage and risk level
      let customActivities = [...baseActivities];

      // Life stage customizations
      if (userProfile.lifeStage === 'teen') {
        customActivities.push({
          title: "Body Awareness Education",
          description: "Learn about normal breast changes",
          category: "self-care",
          timeRequired: "5 min",
          points: 10,
          evidenceBased: "Early awareness builds lifelong protection",
          icon: <Target className="h-4 w-4" />
        });
      }

      if (userProfile.lifeStage === 'reproductive') {
        customActivities.push({
          title: "Monthly BSE Planning",
          description: "Schedule BSE for day 10-14 after period",
          category: "self-care",
          timeRequired: "2 min",
          points: 15,
          evidenceBased: "Early detection when breasts are least tender",
          icon: <Calendar className="h-4 w-4" />
        });
      }

      if (userProfile.lifeStage === 'menopause') {
        customActivities.push({
          title: "Bone Health Focus",
          description: "Calcium-rich foods + strength training",
          category: "movement",
          timeRequired: "20 min",
          points: 12,
          evidenceBased: "Prevents osteoporosis during hormonal changes",
          icon: <Activity className="h-4 w-4" />
        });
      }

      if (userProfile.lifeStage === 'senior') {
        customActivities.push({
          title: "Balance & Flexibility",
          description: "Gentle yoga or tai chi practice",
          category: "movement", 
          timeRequired: "15 min",
          points: 10,
          evidenceBased: "Maintains mobility and reduces fall risk",
          icon: <Activity className="h-4 w-4" />
        });
      }

      // Risk level customizations
      if (userProfile.riskLevel === 'high') {
        customActivities.push({
          title: "Enhanced Self-Monitoring",
          description: "Weekly breast texture check",
          category: "self-care",
          timeRequired: "5 min",
          points: 15,
          evidenceBased: "Critical for high-risk individuals",
          icon: <Target className="h-4 w-4" />
        });
      }

      // Distribute activities across day periods
      const morningActivities = customActivities
        .filter(activity => ['meditation', 'breakfast', 'massage', 'education'].some(keyword => 
          activity.title.toLowerCase().includes(keyword.toLowerCase())
        ))
        .slice(0, 3)
        .map((activity, index) => ({
          ...activity,
          id: `morning-${index}`,
          completed: false
        }));

      const afternoonActivities = customActivities
        .filter(activity => ['walking', 'tea', 'exercise', 'strength'].some(keyword =>
          activity.title.toLowerCase().includes(keyword.toLowerCase())
        ))
        .slice(0, 2)
        .map((activity, index) => ({
          ...activity,
          id: `afternoon-${index}`,
          completed: false
        }));

      const eveningActivities = customActivities
        .filter(activity => ['supplement', 'breathing', 'bse', 'monitoring'].some(keyword =>
          activity.title.toLowerCase().includes(keyword.toLowerCase())
        ))
        .slice(0, 3)
        .map((activity, index) => ({
          ...activity,
          id: `evening-${index}`,
          completed: false
        }));

      const allActivities = [...morningActivities, ...afternoonActivities, ...eveningActivities];
      const totalPoints = allActivities.reduce((sum, activity) => sum + activity.points, 0);

      return {
        date: today,
        morning: morningActivities,
        afternoon: afternoonActivities,
        evening: eveningActivities,
        totalPoints,
        completedPoints: 0
      };
    };

    // Simulate API call delay
    setTimeout(() => {
      setTodaysPlan(generateDailyPlan());
      setLoading(false);
    }, 1000);
  }, [userProfile]);

  const handleActivityToggle = (activityId: string) => {
    if (!todaysPlan) return;

    const updatedPlan = { ...todaysPlan };
    
    // Find and update activity in all time periods
    ['morning', 'afternoon', 'evening'].forEach(period => {
      const activities = updatedPlan[period as keyof Pick<DailyPlan, 'morning' | 'afternoon' | 'evening'>] as DailyActivity[];
      const activityIndex = activities.findIndex(a => a.id === activityId);
      if (activityIndex !== -1) {
        activities[activityIndex].completed = !activities[activityIndex].completed;
      }
    });

    // Recalculate completed points
    const allActivities = [...updatedPlan.morning, ...updatedPlan.afternoon, ...updatedPlan.evening];
    updatedPlan.completedPoints = allActivities
      .filter(activity => activity.completed)
      .reduce((sum, activity) => sum + activity.points, 0);

    setTodaysPlan(updatedPlan);
    
    // Notify parent component
    const activity = allActivities.find(a => a.id === activityId);
    if (activity) {
      onActivityComplete(activityId, activity.completed);
    }
  };

  const getProgressPercentage = () => {
    if (!todaysPlan) return 0;
    return Math.round((todaysPlan.completedPoints / todaysPlan.totalPoints) * 100);
  };

  const renderActivitySection = (title: string, icon: React.ReactNode, activities: DailyActivity[]) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="ml-2">
          {activities.filter(a => a.completed).length}/{activities.length}
        </Badge>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              activity.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleActivityToggle(activity.id)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  activity.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-purple-500'
                }`}
              >
                {activity.completed ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : (
                  <Circle className="h-3 w-3 text-transparent" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${
                    activity.completed ? 'text-green-700 line-through' : 'text-gray-900'
                  }`}>
                    {activity.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.category === 'self-care' ? 'bg-pink-100 text-pink-700' :
                      activity.category === 'nutrition' ? 'bg-green-100 text-green-700' :
                      activity.category === 'movement' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {activity.category}
                    </span>
                    <span className="text-xs text-gray-500">+{activity.points} pts</span>
                  </div>
                </div>
                <p className={`text-sm mb-2 ${
                  activity.completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timeRequired}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    💡 {activity.evidenceBased}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your personalized daily plan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!todaysPlan) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600">Unable to generate daily plan. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Today's Personalized Plan
            </CardTitle>
            <CardDescription>
              Evidence-based activities tailored for {userProfile.lifeStage} stage, {userProfile.riskLevel} risk
            </CardDescription>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {getProgressPercentage()}%
            </div>
            <div className="text-xs text-gray-500">
              {todaysPlan.completedPoints}/{todaysPlan.totalPoints} pts
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderActivitySection(
          "Morning Ritual", 
          <Star className="h-4 w-4 text-yellow-600" />, 
          todaysPlan.morning
        )}
        
        {renderActivitySection(
          "Afternoon Activities",
          <Activity className="h-4 w-4 text-blue-600" />,
          todaysPlan.afternoon
        )}
        
        {renderActivitySection(
          "Evening Reflection",
          <Brain className="h-4 w-4 text-purple-600" />,
          todaysPlan.evening
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Plan
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={() => alert('Weekly plan view coming soon!')}
          >
            📊 View Weekly Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}