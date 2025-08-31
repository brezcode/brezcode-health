import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Trophy,
  Star,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  BarChart3,
  Users,
  Heart,
  Crown,
  Zap
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  category: 'self-care' | 'nutrition' | 'movement' | 'mindfulness';
  points: number;
  completed: boolean;
  completedAt?: Date;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface UserStats {
  totalPoints: number;
  weeklyPoints: number;
  dailyStreak: number;
  longestStreak: number;
  completedActivities: number;
  level: number;
  rank: string;
  percentile: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface Props {
  userId: string;
  activities: Activity[];
  onActivityComplete: (activityId: string, points: number) => void;
}

export default function ActivityTracker({ userId, activities, onActivityComplete }: Props) {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    weeklyPoints: 0,
    dailyStreak: 0,
    longestStreak: 0,
    completedActivities: 0,
    level: 1,
    rank: 'Bronze',
    percentile: 50
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete morning routine 7 days in a row',
      badge: '🌅',
      category: 'Consistency',
      requirement: 7,
      progress: 0,
      unlocked: false
    },
    {
      id: 'self_care_queen',
      title: 'Self-Care Queen',
      description: 'Complete 30 self-care activities',
      badge: '👑',
      category: 'Self-Care',
      requirement: 30,
      progress: 0,
      unlocked: false
    },
    {
      id: 'nutrition_ninja',
      title: 'Nutrition Ninja',
      description: 'Follow Mediterranean diet for 21 days',
      badge: '🥗',
      category: 'Nutrition',
      requirement: 21,
      progress: 0,
      unlocked: false
    },
    {
      id: 'fitness_warrior',
      title: 'Fitness Warrior',
      description: 'Complete 150 minutes of exercise weekly for 4 weeks',
      badge: '💪',
      category: 'Movement',
      requirement: 4,
      progress: 0,
      unlocked: false
    },
    {
      id: 'mindfulness_master',
      title: 'Mindfulness Master',
      description: 'Meditate for 100 total sessions',
      badge: '🧘‍♀️',
      category: 'Mindfulness',
      requirement: 100,
      progress: 0,
      unlocked: false
    },
    {
      id: 'streak_champion',
      title: 'Streak Champion',
      description: 'Maintain 30-day activity streak',
      badge: '🔥',
      category: 'Consistency',
      requirement: 30,
      progress: 0,
      unlocked: false
    },
    {
      id: 'points_collector',
      title: 'Points Collector',
      description: 'Earn 1000 total points',
      badge: '⭐',
      category: 'Progress',
      requirement: 1000,
      progress: 0,
      unlocked: false
    },
    {
      id: 'bse_champion',
      title: 'BSE Champion',
      description: 'Complete monthly BSE for 6 months',
      badge: '🎗️',
      category: 'Prevention',
      requirement: 6,
      progress: 0,
      unlocked: false
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { userId: '1', username: 'Sarah M.', points: 1250, rank: 1, avatar: '🌟' },
    { userId: '2', username: 'Emma K.', points: 1180, rank: 2, avatar: '💫' },
    { userId: '3', username: 'Lisa P.', points: 1120, rank: 3, avatar: '✨' },
    { userId: '4', username: 'Anna R.', points: 980, rank: 4, avatar: '🌸' },
    { userId: userId, username: 'You', points: 750, rank: 5, avatar: '👤', isCurrentUser: true },
    { userId: '6', username: 'Maria L.', points: 720, rank: 6, avatar: '🌺' },
    { userId: '7', username: 'Jennifer W.', points: 680, rank: 7, avatar: '🦋' },
  ]);

  const [selectedTab, setSelectedTab] = useState<'stats' | 'achievements' | 'leaderboard'>('stats');
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);

  // Calculate user stats from activities
  useEffect(() => {
    const completedActivities = activities.filter(a => a.completed);
    const totalPoints = completedActivities.reduce((sum, a) => sum + a.points, 0);
    
    // Calculate weekly points (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivities = completedActivities.filter(a => 
      a.completedAt && a.completedAt > weekAgo
    );
    const weeklyPoints = weeklyActivities.reduce((sum, a) => sum + a.points, 0);

    // Calculate level (every 100 points = 1 level)
    const level = Math.floor(totalPoints / 100) + 1;
    
    // Determine rank based on level
    const getRank = (level: number) => {
      if (level >= 10) return 'Diamond';
      if (level >= 7) return 'Gold';
      if (level >= 4) return 'Silver';
      return 'Bronze';
    };

    setUserStats(prev => ({
      ...prev,
      totalPoints,
      weeklyPoints,
      completedActivities: completedActivities.length,
      level,
      rank: getRank(level),
      dailyStreak: Math.max(...activities.map(a => a.streak), 0)
    }));

    // Update achievement progress
    updateAchievementProgress(completedActivities, totalPoints);
  }, [activities]);

  const updateAchievementProgress = (completedActivities: Activity[], totalPoints: number) => {
    setAchievements(prev => prev.map(achievement => {
      let progress = 0;
      
      switch (achievement.id) {
        case 'early_bird':
          // Count consecutive days with morning activities
          progress = Math.min(userStats.dailyStreak, achievement.requirement);
          break;
        case 'self_care_queen':
          progress = completedActivities.filter(a => a.category === 'self-care').length;
          break;
        case 'nutrition_ninja':
          // Count days with nutrition activities
          progress = completedActivities.filter(a => a.category === 'nutrition').length;
          break;
        case 'fitness_warrior':
          // Count weeks with movement activities  
          progress = Math.floor(completedActivities.filter(a => a.category === 'movement').length / 7);
          break;
        case 'mindfulness_master':
          progress = completedActivities.filter(a => a.category === 'mindfulness').length;
          break;
        case 'streak_champion':
          progress = userStats.dailyStreak;
          break;
        case 'points_collector':
          progress = totalPoints;
          break;
        case 'bse_champion':
          // Count BSE activities (monthly)
          progress = completedActivities.filter(a => 
            a.title.toLowerCase().includes('bse') || a.title.toLowerCase().includes('self-examination')
          ).length;
          break;
      }

      const wasUnlocked = achievement.unlocked;
      const isNowUnlocked = progress >= achievement.requirement;
      
      // Show achievement unlock animation
      if (!wasUnlocked && isNowUnlocked) {
        setShowNewAchievement({ ...achievement, progress, unlocked: true, unlockedAt: new Date() });
        setTimeout(() => setShowNewAchievement(null), 5000);
      }

      return {
        ...achievement,
        progress: Math.min(progress, achievement.requirement),
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt
      };
    }));
  };

  const handleActivityComplete = (activity: Activity) => {
    // Call parent callback
    onActivityComplete(activity.id, activity.points);
    
    // Show points earned animation
    showPointsEarned(activity.points);
  };

  const showPointsEarned = (points: number) => {
    // Create floating points animation
    const pointsElement = document.createElement('div');
    pointsElement.innerHTML = `+${points} pts`;
    pointsElement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-green-600 pointer-events-none z-50 animate-bounce';
    document.body.appendChild(pointsElement);
    
    setTimeout(() => {
      if (document.body.contains(pointsElement)) {
        document.body.removeChild(pointsElement);
      }
    }, 2000);
  };

  const getLevelProgress = () => {
    const currentLevelPoints = userStats.totalPoints % 100;
    return (currentLevelPoints / 100) * 100;
  };

  const getNextLevelPoints = () => {
    return 100 - (userStats.totalPoints % 100);
  };

  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
              <p className="text-purple-100">{userStats.rank} Tier</p>
            </div>
            <div className="text-4xl">
              {userStats.rank === 'Diamond' ? '💎' : 
               userStats.rank === 'Gold' ? '🏆' :
               userStats.rank === 'Silver' ? '🥈' : '🥉'}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{getNextLevelPoints()} pts to go</span>
            </div>
            <div className="w-full bg-purple-700/50 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
            <p className="text-sm text-gray-600">Total Points</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.dailyStreak}</div>
            <p className="text-sm text-gray-600">Daily Streak</p>
            <Flame className="h-4 w-4 text-orange-500 mx-auto mt-1" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.weeklyPoints}</div>
            <p className="text-sm text-gray-600">This Week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.completedActivities}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Self-Care', 'Nutrition', 'Movement', 'Mindfulness'].map((category) => {
              const categoryActivities = activities.filter(a => 
                a.category === category.toLowerCase().replace('-', '') && a.completed
              );
              const categoryPoints = categoryActivities.reduce((sum, a) => sum + a.points, 0);
              const maxPoints = 100; // Adjust based on your scoring system
              const percentage = Math.min((categoryPoints / maxPoints) * 100, 100);
              
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>{categoryPoints} pts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        category === 'Self-Care' ? 'bg-pink-500' :
                        category === 'Nutrition' ? 'bg-green-500' :
                        category === 'Movement' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? 'border-yellow-300 bg-yellow-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{achievement.badge}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <CheckCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.unlocked ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Unlocked {achievement.unlockedAt.toDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Weekly Leaderboard
          </CardTitle>
          <CardDescription>
            Top performers in the breast health community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div 
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isCurrentUser 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500 text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {entry.rank <= 3 ? (
                      entry.rank === 1 ? '🥇' :
                      entry.rank === 2 ? '🥈' : '🥉'
                    ) : entry.rank}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{entry.username}</span>
                      {entry.isCurrentUser && <Badge variant="secondary">You</Badge>}
                    </div>
                    <div className="text-sm text-gray-500">{entry.points} points</div>
                  </div>
                </div>
                <div className="text-2xl">{entry.avatar}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Community Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">10,247</div>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">89,543</div>
              <p className="text-sm text-gray-600">Activities Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">2.3M</div>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* New Achievement Popup */}
      {showNewAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">{showNewAchievement.badge}</div>
              <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
              <h3 className="text-xl font-semibold mb-2">{showNewAchievement.title}</h3>
              <p className="mb-4">{showNewAchievement.description}</p>
              <Button 
                onClick={() => setShowNewAchievement(null)}
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'stats', label: 'Stats', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'achievements', label: 'Achievements', icon: <Award className="h-4 w-4" /> },
          { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'stats' && renderStatsTab()}
      {selectedTab === 'achievements' && renderAchievementsTab()}
      {selectedTab === 'leaderboard' && renderLeaderboardTab()}
    </div>
  );
}