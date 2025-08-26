// User Model - MongoDB with Mongoose
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Authentication
  email: {
    type: String,
    required: function() {
      return !this.phoneNumber;
    },
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  
  phoneNumber: {
    type: String,
    required: function() {
      return !this.email;
    },
    unique: true,
    sparse: true,
    trim: true
  },
  
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Verification Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  verifiedAt: {
    type: Date,
    default: null
  },
  
  // Quiz Data (when they completed registration through quiz)
  quizAnswers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phoneNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ user_id: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update lastLoginAt
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const UserMongo = mongoose.model('User', userSchema);

// User Service Class for database operations
export class UserMongoService {
  
  // Create new user
  static async create(userData) {
    try {
      const user = new UserMongo(userData);
      const savedUser = await user.save();
      console.log(`✅ User created in MongoDB: ${savedUser.user_id}`);
      return savedUser;
    } catch (error) {
      console.error('❌ Error creating user:', error.message);
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const user = await UserMongo.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      console.error('❌ Error finding user by email:', error.message);
      throw error;
    }
  }
  
  // Find user by phone number
  static async findByPhone(phoneNumber) {
    try {
      const user = await UserMongo.findOne({ phoneNumber });
      return user;
    } catch (error) {
      console.error('❌ Error finding user by phone:', error.message);
      throw error;
    }
  }
  
  // Find user by user_id
  static async findByUserId(userId) {
    try {
      const user = await UserMongo.findOne({ user_id: userId });
      return user;
    } catch (error) {
      console.error('❌ Error finding user by ID:', error.message);
      throw error;
    }
  }
  
  // Update user verification status
  static async markAsVerified(userId, verificationType = 'email') {
    try {
      const updateData = {
        verifiedAt: new Date(),
        updatedAt: new Date()
      };
      
      if (verificationType === 'email') {
        updateData.isEmailVerified = true;
      } else if (verificationType === 'phone') {
        updateData.isPhoneVerified = true;
      }
      
      const user = await UserMongo.findOneAndUpdate(
        { user_id: userId },
        updateData,
        { new: true }
      );
      
      return user;
    } catch (error) {
      console.error('❌ Error updating user verification:', error.message);
      throw error;
    }
  }
  
  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const user = await UserMongo.findOneAndUpdate(
        { user_id: userId },
        { 
          ...profileData, 
          updatedAt: new Date() 
        },
        { new: true }
      );
      
      return user;
    } catch (error) {
      console.error('❌ Error updating user profile:', error.message);
      throw error;
    }
  }
  
  // Get user stats
  static async getUserStats() {
    try {
      const totalUsers = await UserMongo.countDocuments();
      const verifiedUsers = await UserMongo.countDocuments({
        $or: [
          { isEmailVerified: true },
          { isPhoneVerified: true }
        ]
      });
      const activeUsers = await UserMongo.countDocuments({ isActive: true });
      
      return {
        totalUsers,
        verifiedUsers,
        activeUsers,
        unverifiedUsers: totalUsers - verifiedUsers
      };
    } catch (error) {
      console.error('❌ Error getting user stats:', error.message);
      throw error;
    }
  }
  
  // Test MongoDB connection with users collection
  static async testConnection() {
    try {
      const count = await UserMongo.countDocuments();
      console.log(`✅ MongoDB connection test passed. Found ${count} users.`);
      return { success: true, count, collection: 'users' };
    } catch (error) {
      console.error('❌ MongoDB users connection test failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default UserMongo;