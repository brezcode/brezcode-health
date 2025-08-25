// QuizResult MongoDB model using Mongoose
import { mongoose } from '../config/mongodb.js';

// Define QuizResult schema
const quizResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  session_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  answers: {
    type: Object,
    required: true
  },
  risk_score: {
    type: Number,
    min: 0,
    max: 100
  },
  risk_level: {
    type: String,
    enum: ['low', 'moderate', 'high']
  },
  recommendations: {
    type: Object,
    default: {}
  },
  ai_analysis: {
    type: Object,
    default: {}
  },
  completed_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We handle timestamps manually
});

// Create the model
const QuizResultMongo = mongoose.model('QuizResult', quizResultSchema);

// MongoDB-based QuizResult operations
class QuizResultMongoService {
  // Create a new quiz result
  static async create(quizData) {
    try {
      const { user_id, answers, risk_score, risk_level, recommendations, ai_analysis } = quizData;
      const session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const quizResult = new QuizResultMongo({
        user_id,
        session_id,
        answers,
        risk_score,
        risk_level,
        recommendations: recommendations || {},
        ai_analysis: ai_analysis || {}
      });
      
      const savedResult = await quizResult.save();
      console.log('✅ Quiz result saved to MongoDB:', savedResult.session_id);
      
      return {
        id: savedResult._id,
        user_id: savedResult.user_id,
        session_id: savedResult.session_id,
        answers: savedResult.answers,
        risk_score: savedResult.risk_score,
        risk_level: savedResult.risk_level,
        recommendations: savedResult.recommendations,
        ai_analysis: savedResult.ai_analysis,
        completed_at: savedResult.completed_at,
        created_at: savedResult.created_at
      };
    } catch (error) {
      console.error('❌ Failed to save quiz result to MongoDB:', error.message);
      throw error;
    }
  }

  // Find quiz result by session ID
  static async findBySessionId(session_id) {
    try {
      const result = await QuizResultMongo.findOne({ session_id });
      
      if (!result) {
        return null;
      }
      
      return {
        id: result._id,
        user_id: result.user_id,
        session_id: result.session_id,
        answers: result.answers,
        risk_score: result.risk_score,
        risk_level: result.risk_level,
        recommendations: result.recommendations,
        ai_analysis: result.ai_analysis,
        completed_at: result.completed_at,
        created_at: result.created_at
      };
    } catch (error) {
      console.error('❌ Failed to find quiz result by session ID:', error.message);
      throw error;
    }
  }

  // Find quiz results by user ID
  static async findByUserId(user_id) {
    try {
      const results = await QuizResultMongo.find({ user_id }).sort({ created_at: -1 });
      
      return results.map(result => ({
        id: result._id,
        user_id: result.user_id,
        session_id: result.session_id,
        answers: result.answers,
        risk_score: result.risk_score,
        risk_level: result.risk_level,
        recommendations: result.recommendations,
        ai_analysis: result.ai_analysis,
        completed_at: result.completed_at,
        created_at: result.created_at
      }));
    } catch (error) {
      console.error('❌ Failed to find quiz results by user ID:', error.message);
      throw error;
    }
  }

  // Get user's latest quiz result
  static async getLatestByUserId(user_id) {
    try {
      const result = await QuizResultMongo.findOne({ user_id }).sort({ created_at: -1 });
      
      if (!result) {
        return null;
      }
      
      return {
        id: result._id,
        user_id: result.user_id,
        session_id: result.session_id,
        answers: result.answers,
        risk_score: result.risk_score,
        risk_level: result.risk_level,
        recommendations: result.recommendations,
        ai_analysis: result.ai_analysis,
        completed_at: result.completed_at,
        created_at: result.created_at
      };
    } catch (error) {
      console.error('❌ Failed to get latest quiz result:', error.message);
      throw error;
    }
  }

  // Get quiz statistics
  static async getStats() {
    try {
      const totalQuizzes = await QuizResultMongo.countDocuments();
      const riskLevelStats = await QuizResultMongo.aggregate([
        { $group: { _id: '$risk_level', count: { $sum: 1 } } }
      ]);
      
      const stats = {
        total_quizzes: totalQuizzes,
        low_risk_count: 0,
        moderate_risk_count: 0,
        high_risk_count: 0
      };
      
      riskLevelStats.forEach(stat => {
        if (stat._id === 'low') stats.low_risk_count = stat.count;
        if (stat._id === 'moderate') stats.moderate_risk_count = stat.count;
        if (stat._id === 'high') stats.high_risk_count = stat.count;
      });
      
      return stats;
    } catch (error) {
      console.error('❌ Failed to get quiz stats:', error.message);
      throw error;
    }
  }

  // Test connection and create sample data
  static async testConnection() {
    try {
      // Try to count documents (this tests the connection)
      const count = await QuizResultMongo.countDocuments();
      console.log(`✅ MongoDB connection test passed. Found ${count} quiz results.`);
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection test failed:', error.message);
      return false;
    }
  }
}

export { QuizResultMongo, QuizResultMongoService };