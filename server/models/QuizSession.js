import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema({
  // User identification
  userId: {
    type: String,
    required: true
  },
  
  // Idempotency hash
  hash: {
    type: String,
    required: true
  },
  
  // Quiz features/answers
  features: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Generated session ID
  session_id: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'quiz_sessions'
});

// Unique index for idempotency
quizSessionSchema.index({ userId: 1, hash: 1 }, { unique: true });

// Additional indexes for performance
quizSessionSchema.index({ session_id: 1 });
quizSessionSchema.index({ createdAt: -1 });

const QuizSession = mongoose.model('QuizSession', quizSessionSchema);

export default QuizSession;