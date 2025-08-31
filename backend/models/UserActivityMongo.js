// User Activity Model - MongoDB with Mongoose
import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  // Unique Identifiers
  activity_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
  
  // Activity Information
  activity_type: {
    type: String,
    enum: [
      'meditation', 'self_exam', 'exercise', 'meal_planning', 'stress_management',
      'breathing_exercise', 'self_massage', 'educational_content', 'doctor_visit',
      'symptom_check', 'medication', 'supplement', 'sleep_tracking', 'mood_tracking'
    ],
    required: true
  },
  
  activity_name: {
    type: String,
    required: true
  },
  
  activity_description: {
    type: String,
    default: ''
  },
  
  // Activity Status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'skipped', 'missed'],
    default: 'pending'
  },
  
  completion_date: {
    type: Date,
    default: null
  },
  
  // Activity Details
  duration_minutes: {
    type: Number,
    default: 0,
    min: 0
  },
  
  intensity_level: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate'
  },
  
  // Activity Data
  activity_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Notes and Feedback
  user_notes: {
    type: String,
    default: ''
  },
  
  user_rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  
  // Scheduling
  scheduled_date: {
    type: Date,
    default: Date.now
  },
  
  reminder_sent: {
    type: Boolean,
    default: false
  },
  
  // Tracking
  is_recurring: {
    type: Boolean,
    default: false
  },
  
  recurrence_pattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: null
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
userActivitySchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Set completion_date when status changes to completed
  if (this.status === 'completed' && !this.completion_date) {
    this.completion_date = new Date();
  }
  
  next();
});

// Indexes for performance
userActivitySchema.index({ user_id: 1 });
userActivitySchema.index({ session_id: 1 });
userActivitySchema.index({ activity_type: 1 });
userActivitySchema.index({ status: 1 });
userActivitySchema.index({ scheduled_date: 1 });
userActivitySchema.index({ completion_date: 1 });
userActivitySchema.index({ created_at: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

// Service class for UserActivity operations
export class UserActivityService {
  static async create(activityData) {
    try {
      const activity = new UserActivity(activityData);
      const savedActivity = await activity.save();
      console.log('✅ User activity created:', savedActivity.activity_id);
      return savedActivity;
    } catch (error) {
      console.error('❌ Error creating user activity:', error);
      throw error;
    }
  }

  static async findBySessionId(session_id, limit = 50) {
    try {
      const activities = await UserActivity.find({ 
        session_id: session_id 
      }).sort({ scheduled_date: -1 }).limit(limit);
      return activities;
    } catch (error) {
      console.error('❌ Error finding activities by session ID:', error);
      throw error;
    }
  }

  static async findByUserId(user_id, limit = 50) {
    try {
      const activities = await UserActivity.find({ 
        user_id: user_id 
      }).sort({ scheduled_date: -1 }).limit(limit);
      return activities;
    } catch (error) {
      console.error('❌ Error finding activities by user ID:', error);
      throw error;
    }
  }

  static async findTodaysActivities(session_id) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const activities = await UserActivity.find({
        session_id: session_id,
        scheduled_date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).sort({ scheduled_date: 1 });

      return activities;
    } catch (error) {
      console.error('❌ Error finding today\'s activities:', error);
      throw error;
    }
  }

  static async completeActivity(activity_id, completion_data = {}) {
    try {
      const updateData = {
        status: 'completed',
        completion_date: new Date(),
        updated_at: new Date(),
        ...completion_data
      };

      const activity = await UserActivity.findOneAndUpdate(
        { activity_id: activity_id },
        updateData,
        { new: true }
      );

      if (activity) {
        console.log('✅ Activity completed:', activity.activity_name);
      }
      return activity;
    } catch (error) {
      console.error('❌ Error completing activity:', error);
      throw error;
    }
  }

  static async getActivityStats(session_id, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await UserActivity.aggregate([
        {
          $match: {
            session_id: session_id,
            created_at: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            activities: { $push: '$activity_name' }
          }
        }
      ]);

      // Calculate completion rate
      const completed = stats.find(s => s._id === 'completed')?.count || 0;
      const total = stats.reduce((sum, s) => sum + s.count, 0);
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        stats: stats,
        completion_rate: completionRate,
        total_activities: total,
        completed_activities: completed,
        period_days: days
      };
    } catch (error) {
      console.error('❌ Error getting activity stats:', error);
      throw error;
    }
  }

  static async generateDefaultActivities(session_id, user_id) {
    try {
      const defaultActivities = [
        {
          user_id: user_id,
          session_id: session_id,
          activity_type: 'meditation',
          activity_name: 'Morning meditation (10 min)',
          activity_description: 'Start your day with mindful breathing and meditation',
          duration_minutes: 10,
          is_recurring: true,
          recurrence_pattern: 'daily'
        },
        {
          user_id: user_id,
          session_id: session_id,
          activity_type: 'self_exam',
          activity_name: 'Breast self-examination',
          activity_description: 'Monthly self-examination for early detection',
          duration_minutes: 15,
          is_recurring: true,
          recurrence_pattern: 'monthly',
          scheduled_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next month
        },
        {
          user_id: user_id,
          session_id: session_id,
          activity_type: 'meal_planning',
          activity_name: 'Healthy meal planning',
          activity_description: 'Plan nutritious meals for the week',
          duration_minutes: 30,
          is_recurring: true,
          recurrence_pattern: 'weekly'
        },
        {
          user_id: user_id,
          session_id: session_id,
          activity_type: 'exercise',
          activity_name: 'Evening walk (30 min)',
          activity_description: 'Gentle cardio exercise to reduce cancer risk',
          duration_minutes: 30,
          is_recurring: true,
          recurrence_pattern: 'daily'
        },
        {
          user_id: user_id,
          session_id: session_id,
          activity_type: 'stress_management',
          activity_name: 'Stress management exercises',
          activity_description: 'Breathing exercises and relaxation techniques',
          duration_minutes: 15,
          is_recurring: true,
          recurrence_pattern: 'daily'
        }
      ];

      const createdActivities = [];
      for (const activityData of defaultActivities) {
        const activity = await this.create(activityData);
        createdActivities.push(activity);
      }

      console.log(`✅ Generated ${createdActivities.length} default activities for session: ${session_id}`);
      return createdActivities;
    } catch (error) {
      console.error('❌ Error generating default activities:', error);
      throw error;
    }
  }
}

export default UserActivity;