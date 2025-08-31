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
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ModifiableDashboard from '../components/ModifiableDashboard';
import DailyPlanGenerator from '../components/DailyPlanGenerator';
import ActivityTracker from '../components/ActivityTracker';
import NotificationManager from '../components/NotificationManager';

export default function EnhancedDashboardLive() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [enhancedReport, setEnhancedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plan' | 'activity' | 'notifications'>('dashboard');
  const [userActivities, setUserActivities] = useState<any[]>([]);
  
  // Default user data
  const currentUser = {
    firstName: 'User',
    lastName: '',
    email: 'user@example.com',
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.location.reload();
  };

  // Handle activity completion
  const handleActivityComplete = (activityId: string, points: number) => {
    console.log(`Activity ${activityId} completed for ${points} points`);
    setUserActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: true, completedAt: new Date() }
          : activity
      )
    );
    
    // Update health metrics with new points
    setHealthMetrics(prev => ({
      ...prev,
      completedActivities: (prev?.completedActivities || 0) + 1,
      streakDays: (prev?.streakDays || 0) + 1
    }));
  };

  // Generate user profile for components
  const userProfile = {
    age: 35,
    lifeStage: 'reproductive' as const,
    riskLevel: healthMetrics?.riskLevel?.toLowerCase() || 'moderate' as const,
    preferences: {
      exerciseType: ['walking', 'yoga'],
      dietaryRestrictions: [],
      availableTime: '30-60 minutes'
    },
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Load real health data from APIs
  useEffect(() => {
    const loadHealthDataFromDatabase = async () => {
      try {
        console.log('🏥 Loading enhanced dashboard data from APIs...');
        
        // Load dashboard metrics
        const dashboardResponse = await fetch('/api/dashboard/latest');
        const dashboardResult = await dashboardResponse.json();
        
        // Load enhanced insights
        const insightsResponse = await fetch('/api/insights/test');
        const insightsResult = await insightsResponse.json();
        
        if (dashboardResult.success && dashboardResult.dashboardData) {
          console.log('✅ Dashboard metrics loaded from database');
          setHealthMetrics(dashboardResult.dashboardData);
        } else {
          console.log('⚠️ No dashboard data - using defaults');
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

        if (insightsResult.success && insightsResult.report) {
          console.log('✅ Enhanced insights loaded from database');
          setEnhancedReport(insightsResult.report);
        } else {
          console.log('⚠️ No enhanced insights available');
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
    
    // Initialize user activities from breast health tasks
    setUserActivities(breastHealthTasks.map(task => ({
      ...task,
      completedAt: task.completed ? new Date() : null,
      streak: task.completed ? 1 : 0
    })));
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
      title: "View Enhanced Report",
      description: "See your detailed health insights",
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      action: () => navigateTo('/report'),
      color: "bg-green-500"
    }
  ];

  const breastHealthTasks = [
    { id: 1, task: "5-minute breast massage with therapy cream", completed: false, points: 10, category: "self-care" },
    { id: 2, task: "Monthly BSE (6-step method)", completed: true, points: 15, category: "self-care" },
    { id: 3, task: "Mediterranean breakfast (berries + Greek yogurt)", completed: true, points: 8, category: "nutrition" },
    { id: 4, task: "150-min weekly exercise goal tracking", completed: false, points: 12, category: "movement" },
    { id: 5, task: "10-minute stress-reduction meditation", completed: false, points: 10, category: "mindfulness" },
    { id: 6, task: "Green tea intake (2-3 cups today)", completed: false, points: 5, category: "nutrition" },
    { id: 7, task: "Vitamin D + Omega-3 supplements", completed: true, points: 8, category: "nutrition" }
  ];

  const dailyHealthTips = [
    {
      title: "The 10-14 Day Rule",
      content: "Check your breasts 10-14 days after your period ends when they're least tender. Most lumps disappear after your period - that's normal! Set a monthly reminder.",
      category: "Early Detection"
    },
    {
      title: "Green Tea Power", 
      content: "Drinking 2-3 cups of green tea daily can reduce breast cancer risk by up to 10%. The EGCG compound helps your body's natural defenses fight abnormal cells.",
      category: "Nutrition"
    },
    {
      title: "The 4-7-8 Breath",
      content: "When stressed, try this: inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times. Chronic stress suppresses immunity - this simple technique activates relaxation.",
      category: "Stress Management"
    },
    {
      title: "150 Minutes = Life Insurance",
      content: "Just 150 minutes of moderate exercise weekly reduces breast cancer risk by 20-30%. That's only 21 minutes daily! Exercise regulates hormones and boosts immunity.",
      category: "Movement"
    }
  ];

  const [todaysTip] = useState(dailyHealthTips[Math.floor(Math.random() * dailyHealthTips.length)]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your enhanced dashboard...</p>
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
                <p className="text-sm text-gray-600">Enhanced Health Dashboard</p>
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
        {/* Welcome Section with Join Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser.firstName}! 👋
            </h2>
            <p className="text-gray-600">
              Here's your enhanced health journey overview with evidence-based insights.
            </p>
          </div>
          <div className="text-center">
            <button 
              onClick={() => alert('Join Daily Health Program - Coming Soon!')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🌟 Join Daily Program
            </button>
            <p className="text-xs text-gray-500 mt-1">Join 10,000+ women taking control</p>
          </div>
        </div>

        {/* Daily Health Tip Widget */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-full">
                <span className="text-lg">💡</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Today's Breast Health Insight</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{todaysTip.category}</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">{todaysTip.title}</h4>
                <p className="text-sm text-gray-600">{todaysTip.content}</p>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Learn More
                  </button>
                  <button className="text-xs border border-blue-300 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                    Share Tip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'dashboard', label: 'Overview', icon: '📊' },
            { id: 'plan', label: 'Daily Plan', icon: '📅' },
            { id: 'activity', label: 'Activity', icon: '🏆' },
            { id: 'notifications', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Enhanced Health Score Overview */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex gap-2 mb-6">
              <div className="flex-1 bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Health Score</span>
              <Heart className="h-4 w-4 opacity-90" />
            </div>
            <div className="text-2xl font-bold">{healthMetrics?.overallScore || 'N/A'}</div>
            <div className="text-sm opacity-90">{healthMetrics?.riskLevel || 'Unknown'} Risk Level</div>
            {enhancedReport?.insights?.evidence_badges && (
              <div className="text-xs mt-1 opacity-75">
                {enhancedReport.insights.evidence_badges.length} Evidence-Based Insights
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Active Days</span>
              <Activity className="h-4 w-4 opacity-90" />
            </div>
            <div className="text-2xl font-bold">{healthMetrics?.activeDays || 0}</div>
            <div className="text-sm opacity-90">This month</div>
            {enhancedReport?.insights?.pain_points && (
              <div className="text-xs mt-1 opacity-75">
                {enhancedReport.insights.pain_points.length} Action Items
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Streak</span>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </div>
            <div className="text-2xl font-bold">{healthMetrics?.streakDays || 0}</div>
            <div className="text-sm opacity-90">Days in a row</div>
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Progress</span>
              <Shield className="h-4 w-4 opacity-90" />
            </div>
              <div className="text-2xl font-bold">{healthMetrics?.completedActivities || 0}%</div>
              <div className="text-sm opacity-90">This week</div>
            </div>
          </div>

          {/* Product Integration Widgets */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-pink-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-pink-600">🧴</span>
                </div>
                <h3 className="font-semibold text-gray-900">Xynargy Therapy Cream</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Curcumin-enriched breast therapy cream with ginseng and green tea extract</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-pink-500 text-white text-xs px-3 py-2 rounded hover:bg-pink-600">
                  Order Now
                </button>
                <button className="text-xs border border-pink-300 text-pink-600 px-3 py-2 rounded hover:bg-pink-50">
                  Learn More
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-purple-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600">🔬</span>
                </div>
                <h3 className="font-semibold text-gray-900">BG Screening Device</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">AI-powered home breast screening for early detection monitoring</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-500 text-white text-xs px-3 py-2 rounded hover:bg-purple-600">
                  Schedule Scan
                </button>
                <button className="text-xs border border-purple-300 text-purple-600 px-3 py-2 rounded hover:bg-purple-50">
                  View Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">💊</span>
                </div>
                <h3 className="font-semibold text-gray-900">Daily Supplements</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Vitamin D (2000 IU), Omega-3 (2g), Green Tea Extract (300mg)</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-green-500 text-white text-xs px-3 py-2 rounded hover:bg-green-600">
                  Track Today
                </button>
                <button className="text-xs border border-green-300 text-green-600 px-3 py-2 rounded hover:bg-green-50">
                  Reorder
                </button>
              </div>
            </div>
          </div>

        {/* Enhanced Evidence Badges Preview */}
        {enhancedReport?.insights?.evidence_badges && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                Evidence-Based Insights
              </CardTitle>
              <CardDescription>
                Key findings from your assessment with research backing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {enhancedReport.insights.evidence_badges.slice(0, 3).map((badge: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{badge.label}</h4>
                    <p className="text-xs text-gray-600 mb-2">{badge.evidence_text}</p>
                    <div className="text-xs text-blue-600 font-medium">{badge.strength}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigateTo('/report')}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  View Full Enhanced Report <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Modifiable-Focused Dashboard */}
        {(healthMetrics?.insights?.evidenceBasedRisk || enhancedReport?.insights?.evidenceBasedRisk) ? (
          <ModifiableDashboard 
            evidenceBasedRisk={
              healthMetrics?.insights?.evidenceBasedRisk || 
              enhancedReport?.insights?.evidenceBasedRisk
            }
          />
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Loading Your Personalized Dashboard</h3>
              <p className="text-yellow-800 text-sm mb-4">
                We're calculating your evidence-based risk factors and modifiable action plan.
              </p>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => navigateTo('/quiz')}
              >
                Complete Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Quick Access to Enhanced Report */}
        <Card className="mt-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardContent className="text-center p-6">
            <BarChart3 className="h-12 w-12 text-purple-200 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Complete Health Analysis</h3>
            <p className="text-purple-100 mb-4">
              View your comprehensive report with urgency messaging, evidence-based insights, and detailed action plans.
            </p>
            <Button 
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={() => navigateTo('/report')}
            >
              🔬 View Complete Report
            </Button>
          </CardContent>
        </Card>
      </div>
    )}

        {/* Daily Plan Tab */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <DailyPlanGenerator 
              userProfile={userProfile}
              onActivityComplete={handleActivityComplete}
            />
          </div>
        )}

        {/* Activity Tracker Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <ActivityTracker
              userId={currentUser.email}
              activities={userActivities}
              onActivityComplete={handleActivityComplete}
            />
          </div>
        )}

        {/* Notifications Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationManager
              userId={currentUser.email}
              userProfile={userProfile}
            />
          </div>
        )}

        <div style={{display: 'none'}} className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          {/* Enhanced Quick Actions */}
          <div className="col-span-1 lg:col-span-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Enhanced Actions
                </CardTitle>
                <CardDescription>
                  AI-powered recommendations based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Featured Enhanced Report Button */}
                <Button
                  className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 justify-start p-4"
                  onClick={() => navigateTo('/report')}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">View Enhanced Report</div>
                    <div className="text-sm text-purple-100">Evidence-based insights with expert guidance</div>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Button>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start hover:border-purple-300"
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

            {/* Enhanced Breast Health Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Today's Breast Health Goals
                  </div>
                  <div className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {breastHealthTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0)} / {breastHealthTasks.reduce((sum, task) => sum + task.points, 0)} pts
                  </div>
                </CardTitle>
                <CardDescription>
                  Evidence-based daily activities for optimal breast health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {breastHealthTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
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
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.category === 'self-care' ? 'bg-pink-100 text-pink-700' :
                        task.category === 'nutrition' ? 'bg-green-100 text-green-700' :
                        task.category === 'movement' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {task.category}
                      </span>
                      <span className="text-xs text-gray-500">+{task.points} pts</span>
                    </div>
                  </div>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" className="flex-1" size="sm">
                    Track Activity
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600" size="sm">
                    View Weekly Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* Enhanced Health Summary */}
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
                {enhancedReport?.insights?.evidence_badges && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Evidence Insights</span>
                    <span className="text-sm font-medium text-purple-600">
                      {enhancedReport.insights.evidence_badges.length} Available
                    </span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigateTo('/quiz')}
                >
                  Update Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Dr. Sakura Chat */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                  Dr. Sakura AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  "I've analyzed your enhanced report with {enhancedReport?.insights?.evidence_badges?.length || 0} evidence-based insights. 
                  Would you like personalized guidance on your action items?"
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => alert('Enhanced AI Chat - Coming Soon!')}
                >
                  Chat with Enhanced AI
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
                  <span className="text-gray-600">Enhanced report generated</span>
                  <span className="text-gray-400">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evidence insights analyzed</span>
                  <span className="text-gray-400">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health assessment completed</span>
                  <span className="text-gray-400">1d ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}