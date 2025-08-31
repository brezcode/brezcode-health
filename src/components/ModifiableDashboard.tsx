import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Zap,
  Activity,
  Apple,
  Heart,
  Shield,
  Award,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ModifiableDashboardProps {
  evidenceBasedRisk: {
    riskFactors: {
      modifiable: { [key: string]: any };
    };
    modifiableReduction: number;
  };
}

export default function ModifiableDashboard({ evidenceBasedRisk }: ModifiableDashboardProps) {
  const [completedToday, setCompletedToday] = useState<string[]>([
    'morning_walk', 'green_tea', 'meditation'
  ]);

  // Today's action items based on evidence-based priorities
  const dailyActions = [
    {
      id: 'morning_walk',
      category: 'Physical Activity',
      action: '30-minute brisk walk',
      riskReduction: 15,
      timeEstimate: '30 min',
      urgency: 'high',
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: 'mediterranean_meal',
      category: 'Nutrition',
      action: 'Prepare Mediterranean-style lunch',
      riskReduction: 12,
      timeEstimate: '45 min',
      urgency: 'high',
      icon: <Apple className="h-5 w-5" />
    },
    {
      id: 'no_alcohol',
      category: 'Lifestyle',
      action: 'Alcohol-free day',
      riskReduction: 25,
      timeEstimate: 'All day',
      urgency: 'high',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'meditation',
      category: 'Stress Management',
      action: '10-minute mindfulness meditation',
      riskReduction: 8,
      timeEstimate: '10 min',
      urgency: 'medium',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 'green_tea',
      category: 'Nutrition',
      action: 'Drink 3 cups green tea',
      riskReduction: 10,
      timeEstimate: '5 min',
      urgency: 'medium',
      icon: <Apple className="h-5 w-5" />
    },
    {
      id: 'sleep_prep',
      category: 'Recovery',
      action: 'Prepare for 8-hour sleep',
      riskReduction: 9,
      timeEstimate: '20 min',
      urgency: 'medium',
      icon: <Clock className="h-5 w-5" />
    }
  ];

  const toggleAction = (actionId: string) => {
    setCompletedToday(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const completedReduction = dailyActions
    .filter(action => completedToday.includes(action.id))
    .reduce((sum, action) => sum + action.riskReduction, 0);

  const progressPercentage = Math.round((completedToday.length / dailyActions.length) * 100);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress Overview */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-green-900 flex items-center">
                <Target className="h-6 w-6 mr-2" />
                Daily Risk Reduction Progress
              </CardTitle>
              <CardDescription className="text-green-700">
                Focus only on what you can control today
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                -{completedReduction}%
              </div>
              <div className="text-sm text-green-700">risk reduced today</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Daily Progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{completedToday.length}</div>
              <div className="text-sm text-gray-600">Actions completed</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{dailyActions.length - completedToday.length}</div>
              <div className="text-sm text-gray-600">Actions remaining</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">Day streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            Today's Evidence-Based Actions
          </CardTitle>
          <CardDescription>
            Each action is backed by peer-reviewed research showing specific risk reduction percentages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyActions.map((action) => (
              <div 
                key={action.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  completedToday.includes(action.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => toggleAction(action.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                      completedToday.includes(action.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {completedToday.includes(action.id) && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-600">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{action.action}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {action.timeEstimate}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{action.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getUrgencyColor(action.urgency)}>
                      {action.urgency}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      -{action.riskReduction}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motivation Footer */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="text-center">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center justify-center">
                <Award className="h-5 w-5 mr-2" />
                Your Potential This Week
              </h4>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                -{Math.min(completedReduction * 7, 200)}%
              </div>
              <p className="text-yellow-800 text-sm">
                Keep up this daily routine for maximum risk reduction impact
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends - Modifiable Factors Only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
            Your Modifiable Risk Trends
          </CardTitle>
          <CardDescription>
            Track progress on factors you can change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Physical Activity */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Physical Activity</div>
                  <div className="text-sm text-gray-600">5/7 days this week</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">↑ 18%</Badge>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Nutrition */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Apple className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Nutrition Quality</div>
                  <div className="text-sm text-gray-600">Mediterranean diet 6/7 days</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">↑ 22%</Badge>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Stress Management */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Stress Management</div>
                  <div className="text-sm text-gray-600">Daily meditation streak: 15 days</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-100 text-purple-800">↑ 35%</Badge>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action CTA */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardContent className="text-center p-6">
          <Zap className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Ready for Your Next Level?</h3>
          <p className="text-indigo-100 mb-4">
            You're making amazing progress! Ready to unlock even more risk reduction strategies?
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            🚀 Advance to Phase 2
          </button>
        </CardContent>
      </Card>
    </div>
  );
}