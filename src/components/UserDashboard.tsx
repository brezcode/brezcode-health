import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Shield, 
  User,
  Bell,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function UserDashboard() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Default user data (no localStorage dependency)
  const currentUser = {
    firstName: 'User',
    lastName: '',
    email: 'user@example.com',
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.location.reload(); // Force reload to trigger App.tsx routing
  };

  // Load real health data directly from MongoDB database (NO localStorage)
  useEffect(() => {
    const loadHealthDataFromDatabase = async () => {
      try {
        console.log('🏥 Fetching latest dashboard data directly from MongoDB...');
        
        // Get latest dashboard data directly from database
        const response = await fetch('/api/dashboard/latest');
        const result = await response.json();
        
        if (result.success && result.dashboardData) {
          console.log('✅ Dashboard data loaded directly from MongoDB database');
          setHealthMetrics(result.dashboardData);
        } else {
          console.log('❌ No dashboard data found - user needs to complete quiz');
          setHealthMetrics({
            overallScore: 'N/A',
            riskLevel: "Complete Quiz",
            activeDays: 0,
            assessmentDate: "Not completed",
            nextCheckup: "Complete quiz first",
            streakDays: 0,
            completedActivities: 0
          });
        }
        
      } catch (error) {
        console.error('❌ Database error:', error);
        setHealthMetrics({
          overallScore: 'Error',
          riskLevel: "Connection Failed",
          activeDays: 0,
          assessmentDate: "Unable to load",
          nextCheckup: "Check connection",
          streakDays: 0,
          completedActivities: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadHealthDataFromDatabase();
  }, []);

  const quickActions = [
    {
      title: "Chat with Dr. Sakura",
      description: "Get personalized health guidance",
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      action: () => alert('Dr. Sakura AI Chat - Coming Soon!'),
      color: "bg-pink-500"
    },
    {
      title: "Health Calendar",
      description: "View your wellness schedule",
      icon: <Calendar className="h-6 w-6 text-white" />,
      action: () => alert('Health Calendar - Coming Soon!'),
      color: "bg-purple-500"
    },
    {
      title: "Track Activities",
      description: "Log today's health activities",
      icon: <Activity className="h-6 w-6 text-white" />,
      action: () => alert('Activity Tracker - Coming Soon!'),
      color: "bg-blue-500"
    },
    {
      title: "View Report",
      description: "See your latest health assessment",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      action: () => navigateTo('/report'),
      color: "bg-green-500"
    }
  ];

  const todaysTasks = [
    { id: 1, task: "Morning meditation (10 min)", completed: true },
    { id: 2, task: "Breast self-examination", completed: false },
    { id: 3, task: "Healthy meal planning", completed: true },
    { id: 4, task: "Evening walk (30 min)", completed: false },
    { id: 5, task: "Stress management exercises", completed: false }
  ];

  // Show loading state while fetching data from database
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your health dashboard from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BrezCode
                </h1>
                <p className="text-sm text-gray-600">Personal Health Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-gray-900"
                onClick={() => navigateTo('/')}
              >
                <LogOut className="h-4 w-4" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{currentUser.firstName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            Here's your health journey overview for today.
          </p>
        </div>

        {/* Health Score Overview */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-white rounded-lg border border-pink-100 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Overall Health Score</span>
              <Heart className="h-3 w-3 text-pink-500" />
            </div>
            <div className="text-lg font-bold text-green-600">{healthMetrics?.overallScore || 'N/A'}</div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1 py-0 mt-1">
              {healthMetrics?.riskLevel || 'Unknown'} Risk
            </Badge>
          </div>
          
          <div className="flex-1 bg-white rounded-lg border border-purple-100 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Active Days</span>
              <Activity className="h-3 w-3 text-purple-500" />
            </div>
            <div className="text-lg font-bold text-purple-600">{healthMetrics?.activeDays || 0}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="flex-1 bg-white rounded-lg border border-blue-100 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Current Streak</span>
              <TrendingUp className="h-3 w-3 text-blue-500" />
            </div>
            <div className="text-lg font-bold text-blue-600">{healthMetrics?.streakDays || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Days in a row</p>
          </div>
          
          <div className="flex-1 bg-white rounded-lg border border-orange-100 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Activities Done</span>
              <Shield className="h-3 w-3 text-orange-500" />
            </div>
            <div className="text-lg font-bold text-orange-600">{healthMetrics?.completedActivities || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          {/* Quick Actions */}
          <div className="col-span-1 lg:col-span-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Featured Chat with AI Button */}
                <Button
                  className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 justify-start p-4"
                  onClick={() => alert('Dr. Sakura AI Chat - Coming Soon!')}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">Chat with Dr. Sakura AI</div>
                    <div className="text-sm text-pink-100">Get personalized health guidance 24/7</div>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Button>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.slice(1).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start hover:border-pink-300"
                      onClick={action.action}
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Today's Wellness Tasks
                </CardTitle>
                <CardDescription>
                  Track your daily health activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {task.completed && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.task}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Activities
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Assessment</span>
                  <span className="text-sm font-medium">{healthMetrics?.assessmentDate || 'Not completed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Checkup</span>
                  <span className="text-sm font-medium">{healthMetrics?.nextCheckup || 'Complete quiz first'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {healthMetrics?.riskLevel || 'Unknown'}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigateTo('/quiz')}
                >
                  Update Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Dr. Sakura Chat */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                  Dr. Sakura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  "Good morning! I noticed you've been doing great with your morning routines. 
                  Would you like some tips for today's self-examination?"
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => alert('Dr. Sakura AI Chat - Coming Soon!')}
                >
                  Chat Now
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest health activities
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed meditation</span>
                  <span className="text-gray-400">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health report generated</span>
                  <span className="text-gray-400">1d ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dr. Sakura chat session</span>
                  <span className="text-gray-400">2d ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}