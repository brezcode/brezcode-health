// Health Report Model - MongoDB with Mongoose
import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema({
  // Unique Identifiers
  report_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Links to other collections
  user_id: {
    type: String,
    required: true,
    index: true
  },
  
  session_id: {
    type: String,
    required: true,
    index: true
  },
  
  quiz_result_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizResult',
    required: true
  },
  
  // Report Data
  riskScore: {
    type: String,
    required: true
  },
  
  riskCategory: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    required: true
  },
  
  userProfile: {
    type: String,
    enum: ['teenager', 'premenopausal', 'postmenopausal', 'current_patient', 'survivor'],
    required: true
  },
  
  riskFactors: [{
    type: String
  }],
  
  recommendations: [{
    type: String
  }],
  
  // Detailed Report Structure
  reportData: {
    summary: {
      totalRiskScore: String,
      totalHealthScore: String,
      uncontrollableHealthScore: String,
      overallRiskCategory: String,
      userProfile: String,
      profileDescription: String,
      totalSections: Number
    },
    
    sectionAnalysis: {
      sectionScores: mongoose.Schema.Types.Mixed,
      sectionSummaries: mongoose.Schema.Types.Mixed,
      sectionBreakdown: [{
        name: String,
        score: Number,
        factorCount: Number,
        riskLevel: String,
        riskFactors: [String]
      }]
    },
    
    personalizedPlan: {
      dailyPlan: {
        morning: String,
        afternoon: String,
        evening: String,
        weekly: {
          exercise_goals: String,
          nutrition_focus: String,
          stress_management: String
        },
        supplements: [String]
      },
      coachingFocus: [String],
      followUpTimeline: mongoose.Schema.Types.Mixed
    }
  },
  
  // AI Analysis Data (if available)
  ai_analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Report Metadata
  generated_by: {
    type: String,
    default: 'system',
    enum: ['system', 'ai', 'manual']
  },
  
  report_version: {
    type: String,
    default: '1.0'
  },
  
  // Status
  status: {
    type: String,
    enum: ['generated', 'viewed', 'shared', 'archived'],
    default: 'generated'
  },
  
  // Timestamps
  generatedAt: {
    type: Date,
    default: Date.now
  },
  
  viewedAt: {
    type: Date,
    default: null
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'health_reports'
});

// Indexes for better performance
healthReportSchema.index({ user_id: 1, generatedAt: -1 });
healthReportSchema.index({ session_id: 1 }, { unique: true });
healthReportSchema.index({ report_id: 1 }, { unique: true });
healthReportSchema.index({ riskCategory: 1 });
healthReportSchema.index({ generatedAt: -1 });

// Update last accessed timestamp
healthReportSchema.methods.markAsAccessed = async function() {
  this.lastAccessedAt = new Date();
  if (!this.viewedAt) {
    this.viewedAt = new Date();
    this.status = 'viewed';
  }
  return this.save();
};

// Update status
healthReportSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return this.save();
};

const HealthReportMongo = mongoose.model('HealthReport', healthReportSchema);

// Health Report Service Class
export class HealthReportService {
  
  // Create and save health report
  static async create(reportData) {
    try {
      const report = new HealthReportMongo(reportData);
      const savedReport = await report.save();
      console.log(`✅ Health report created in MongoDB: ${savedReport.report_id}`);
      return savedReport;
    } catch (error) {
      console.error('❌ Error creating health report:', error.message);
      throw error;
    }
  }
  
  // Find report by session ID
  static async findBySessionId(sessionId) {
    try {
      const report = await HealthReportMongo.findOne({ session_id: sessionId })
        .populate('quiz_result_id');
      
      if (report) {
        // Update access timestamp
        await report.markAsAccessed();
      }
      
      return report;
    } catch (error) {
      console.error('❌ Error finding report by session ID:', error.message);
      throw error;
    }
  }
  
  // Find report by report ID
  static async findByReportId(reportId) {
    try {
      const report = await HealthReportMongo.findOne({ report_id: reportId })
        .populate('quiz_result_id');
      
      if (report) {
        await report.markAsAccessed();
      }
      
      return report;
    } catch (error) {
      console.error('❌ Error finding report by report ID:', error.message);
      throw error;
    }
  }
  
  // Get all reports for a user
  static async findByUserId(userId, limit = 10) {
    try {
      const reports = await HealthReportMongo.find({ user_id: userId })
        .sort({ generatedAt: -1 })
        .limit(limit)
        .populate('quiz_result_id');
      
      return reports;
    } catch (error) {
      console.error('❌ Error finding reports by user ID:', error.message);
      throw error;
    }
  }
  
  // Get latest report for a user
  static async getLatestByUserId(userId) {
    try {
      const report = await HealthReportMongo.findOne({ user_id: userId })
        .sort({ generatedAt: -1 })
        .populate('quiz_result_id');
      
      if (report) {
        await report.markAsAccessed();
      }
      
      return report;
    } catch (error) {
      console.error('❌ Error getting latest report by user ID:', error.message);
      throw error;
    }
  }
  
  // Update report status
  static async update(reportId, updateData) {
    try {
      const report = await HealthReportMongo.findByIdAndUpdate(
        reportId, 
        { ...updateData, updated_at: new Date() },
        { new: true }
      );
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      console.log(`✅ Health report updated in MongoDB: ${report.report_id}`);
      return report;
    } catch (error) {
      console.error('❌ Error updating health report:', error.message);
      throw error;
    }
  }

  static async updateReportStatus(reportId, status) {
    try {
      const report = await HealthReportMongo.findOne({ report_id: reportId });
      if (!report) {
        throw new Error('Report not found');
      }
      
      await report.updateStatus(status);
      return report;
    } catch (error) {
      console.error('❌ Error updating report status:', error.message);
      throw error;
    }
  }
  
  // Get report statistics
  static async getReportStats() {
    try {
      const totalReports = await HealthReportMongo.countDocuments();
      const reportsByRisk = await HealthReportMongo.aggregate([
        {
          $group: {
            _id: '$riskCategory',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const reportsByProfile = await HealthReportMongo.aggregate([
        {
          $group: {
            _id: '$userProfile',
            count: { $sum: 1 }
          }
        }
      ]);
      
      const recentReports = await HealthReportMongo.countDocuments({
        generatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      });
      
      return {
        totalReports,
        recentReports,
        reportsByRisk: reportsByRisk.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        reportsByProfile: reportsByProfile.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('❌ Error getting report stats:', error.message);
      throw error;
    }
  }
  
  // Test MongoDB connection with health reports collection
  static async testConnection() {
    try {
      const count = await HealthReportMongo.countDocuments();
      console.log(`✅ MongoDB connection test passed. Found ${count} health reports.`);
      return { success: true, count, collection: 'health_reports' };
    } catch (error) {
      console.error('❌ MongoDB health reports connection test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default HealthReportMongo;