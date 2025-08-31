// Dashboard Metrics Model - MongoDB with Mongoose
import mongoose from 'mongoose';

const dashboardMetricsSchema = new mongoose.Schema({
  // Unique Identifiers
  metric_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  
  // User and Session Links
  user_id: {
    type: String,
    required: true
  },
  
  session_id: {
    type: String,
    required: true
  },
  
  // Health Metrics
  overall_score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  
  risk_level: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  
  // Activity Metrics
  active_days: {
    type: Number,
    default: 0,
    min: 0
  },
  
  streak_days: {
    type: Number,
    default: 0,
    min: 0
  },
  
  completed_activities_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Assessment Information
  assessment_date: {
    type: Date,
    required: true
  },
  
  next_checkup_date: {
    type: Date,
    required: true
  },
  
  // Activity Breakdown
  activities_completed: {
    type: [{
      activity_name: String,
      completed_count: { type: Number, default: 0 },
      total_count: { type: Number, default: 0 },
      last_completed: Date
    }],
    default: []
  },
  
  // Health Goals Progress
  health_goals: {
    type: [{
      goal_name: String,
      target_value: Number,
      current_value: Number,
      unit: String,
      progress_percentage: Number
    }],
    default: []
  },
  
  // Recent Achievements
  achievements: {
    type: [{
      achievement_name: String,
      earned_date: Date,
      description: String
    }],
    default: []
  },
  
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
dashboardMetricsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Indexes for performance
dashboardMetricsSchema.index({ user_id: 1 });
dashboardMetricsSchema.index({ session_id: 1 });
dashboardMetricsSchema.index({ assessment_date: -1 });
dashboardMetricsSchema.index({ created_at: -1 });

const DashboardMetrics = mongoose.model('DashboardMetrics', dashboardMetricsSchema);

// Service class for DashboardMetrics operations
export class DashboardMetricsService {
  static async create(metricsData) {
    try {
      const metrics = new DashboardMetrics(metricsData);
      const savedMetrics = await metrics.save();
      console.log('✅ Dashboard metrics created:', savedMetrics.metric_id);
      return savedMetrics;
    } catch (error) {
      console.error('❌ Error creating dashboard metrics:', error);
      throw error;
    }
  }

  static async findBySessionId(session_id) {
    try {
      const metrics = await DashboardMetrics.findOne({ 
        session_id: session_id 
      }).sort({ created_at: -1 });
      return metrics;
    } catch (error) {
      console.error('❌ Error finding metrics by session ID:', error);
      throw error;
    }
  }

  static async findByUserId(user_id) {
    try {
      const metrics = await DashboardMetrics.findOne({ 
        user_id: user_id 
      }).sort({ created_at: -1 });
      return metrics;
    } catch (error) {
      console.error('❌ Error finding metrics by user ID:', error);
      throw error;
    }
  }

  static async updateMetrics(session_id, updateData) {
    try {
      const metrics = await DashboardMetrics.findOneAndUpdate(
        { session_id: session_id },
        { ...updateData, updated_at: new Date() },
        { new: true, upsert: true }
      );
      console.log('✅ Dashboard metrics updated:', metrics.metric_id);
      return metrics;
    } catch (error) {
      console.error('❌ Error updating dashboard metrics:', error);
      throw error;
    }
  }

  static async incrementActivity(session_id, activity_name) {
    try {
      const metrics = await DashboardMetrics.findOne({ session_id: session_id });
      if (!metrics) {
        throw new Error('Dashboard metrics not found for session');
      }

      // Find or create activity entry
      let activityEntry = metrics.activities_completed.find(a => a.activity_name === activity_name);
      if (!activityEntry) {
        activityEntry = {
          activity_name: activity_name,
          completed_count: 0,
          total_count: 1,
          last_completed: null
        };
        metrics.activities_completed.push(activityEntry);
      }

      // Increment completed count
      activityEntry.completed_count += 1;
      activityEntry.last_completed = new Date();

      // Recalculate completion percentage
      const totalCompleted = metrics.activities_completed.reduce((sum, a) => sum + a.completed_count, 0);
      const totalActivities = metrics.activities_completed.reduce((sum, a) => sum + a.total_count, 0);
      metrics.completed_activities_percentage = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;

      // Update active days and streak
      const today = new Date().toDateString();
      const lastActivity = metrics.updated_at ? metrics.updated_at.toDateString() : null;
      
      if (lastActivity !== today) {
        metrics.active_days += 1;
        
        // Check if streak continues (yesterday or today)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        if (lastActivity === yesterday || !lastActivity) {
          metrics.streak_days += 1;
        } else {
          metrics.streak_days = 1; // Reset streak
        }
      }

      metrics.updated_at = new Date();
      const savedMetrics = await metrics.save();
      
      console.log('✅ Activity incremented:', activity_name, 'for session:', session_id);
      return savedMetrics;
    } catch (error) {
      console.error('❌ Error incrementing activity:', error);
      throw error;
    }
  }

  static async getLatest() {
    try {
      const metrics = await DashboardMetrics.findOne({}).sort({ created_at: -1 });
      return metrics;
    } catch (error) {
      console.error('❌ Error getting latest metrics:', error);
      throw error;
    }
  }

  static async clearAll() {
    try {
      const result = await DashboardMetrics.deleteMany({});
      console.log(`✅ Cleared ${result.deletedCount} dashboard metrics records`);
      return result;
    } catch (error) {
      console.error('❌ Error clearing dashboard metrics:', error);
      throw error;
    }
  }

  static async generateFromQuizResult(quizResult, healthReport) {
    try {
      // Calculate next checkup date (3 months from assessment)
      const nextCheckupDate = new Date(quizResult.created_at);
      nextCheckupDate.setMonth(nextCheckupDate.getMonth() + 3);

      // Initialize default activities
      const defaultActivities = [
        { activity_name: 'Morning meditation', completed_count: 0, total_count: 30, last_completed: null },
        { activity_name: 'Breast self-examination', completed_count: 0, total_count: 1, last_completed: null },
        { activity_name: 'Healthy meal planning', completed_count: 0, total_count: 7, last_completed: null },
        { activity_name: 'Evening walk', completed_count: 0, total_count: 21, last_completed: null },
        { activity_name: 'Stress management exercises', completed_count: 0, total_count: 14, last_completed: null }
      ];

      const metricsData = {
        user_id: quizResult.user_id,
        session_id: quizResult.session_id,
        overall_score: healthReport?.reportData?.summary?.totalHealthScore || (100 - (quizResult.risk_score || 15)) || 85,
        risk_level: healthReport?.reportData?.summary?.overallRiskCategory || quizResult.risk_level || 'low',
        active_days: 1, // First day
        streak_days: 1, // Starting streak
        completed_activities_percentage: 0, // No activities completed yet
        assessment_date: quizResult.created_at,
        next_checkup_date: nextCheckupDate,
        activities_completed: defaultActivities,
        health_goals: [
          {
            goal_name: 'Monthly Self-Exams',
            target_value: 1,
            current_value: 0,
            unit: 'examinations',
            progress_percentage: 0
          },
          {
            goal_name: 'Weekly Exercise Sessions',
            target_value: 3,
            current_value: 0,
            unit: 'sessions',
            progress_percentage: 0
          },
          {
            goal_name: 'Daily Mindfulness',
            target_value: 10,
            current_value: 0,
            unit: 'minutes',
            progress_percentage: 0
          }
        ],
        achievements: []
      };

      return await this.create(metricsData);
    } catch (error) {
      console.error('❌ Error generating dashboard metrics from quiz result:', error);
      throw error;
    }
  }
}

export default DashboardMetrics;