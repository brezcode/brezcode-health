// Verification Code Model - MongoDB with Mongoose
import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  // User Identification
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  
  phoneNumber: {
    type: String,
    sparse: true,
    trim: true
  },
  
  // Verification Code
  code: {
    type: String,
    required: true,
    length: 6
  },
  
  // Verification Type
  type: {
    type: String,
    enum: ['email', 'whatsapp', 'sms'],
    required: true,
    default: 'email'
  },
  
  // Status Tracking
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  
  isUsed: {
    type: Boolean,
    default: false
  },
  
  // Timing
  expiryTime: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Auto-delete after 1 hour (3600 seconds)
  }
}, {
  timestamps: true,
  collection: 'verification_codes'
});

// Indexes
verificationCodeSchema.index({ email: 1, type: 1 });
verificationCodeSchema.index({ phoneNumber: 1, type: 1 });
verificationCodeSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 0 });
verificationCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Check if code is valid (not expired and not used)
verificationCodeSchema.methods.isValid = function() {
  return !this.isUsed && new Date() < this.expiryTime && this.attempts < 5;
};

// Mark code as used
verificationCodeSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  return this.save();
};

// Increment attempts
verificationCodeSchema.methods.incrementAttempts = async function() {
  this.attempts += 1;
  return this.save();
};

const VerificationCodeMongo = mongoose.model('VerificationCode', verificationCodeSchema);

// Verification Code Service Class
export class VerificationCodeService {
  
  // Generate 6-digit verification code
  static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Create verification code for email
  static async createEmailCode(email) {
    try {
      // Delete any existing codes for this email
      await VerificationCodeMongo.deleteMany({ email: email.toLowerCase(), type: 'email' });
      
      const code = this.generateCode();
      const verificationCode = new VerificationCodeMongo({
        email: email.toLowerCase(),
        code,
        type: 'email',
        expiryTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });
      
      const savedCode = await verificationCode.save();
      console.log(`✅ Email verification code created for ${email}: ${code}`);
      return savedCode;
    } catch (error) {
      console.error('❌ Error creating email verification code:', error.message);
      throw error;
    }
  }
  
  // Create verification code for WhatsApp
  static async createWhatsAppCode(phoneNumber) {
    try {
      // Delete any existing codes for this phone number
      await VerificationCodeMongo.deleteMany({ phoneNumber, type: 'whatsapp' });
      
      const code = this.generateCode();
      const verificationCode = new VerificationCodeMongo({
        phoneNumber,
        code,
        type: 'whatsapp',
        expiryTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });
      
      const savedCode = await verificationCode.save();
      console.log(`✅ WhatsApp verification code created for ${phoneNumber}: ${code}`);
      return savedCode;
    } catch (error) {
      console.error('❌ Error creating WhatsApp verification code:', error.message);
      throw error;
    }
  }
  
  // Verify email code
  static async verifyEmailCode(email, inputCode) {
    try {
      const verification = await VerificationCodeMongo.findOne({
        email: email.toLowerCase(),
        type: 'email',
        isUsed: false
      }).sort({ createdAt: -1 });
      
      if (!verification) {
        return { success: false, error: 'No verification code found for this email' };
      }
      
      if (!verification.isValid()) {
        if (verification.attempts >= 5) {
          return { success: false, error: 'Too many failed attempts. Please request a new code.' };
        }
        if (new Date() > verification.expiryTime) {
          return { success: false, error: 'Verification code has expired' };
        }
        return { success: false, error: 'Verification code is invalid' };
      }
      
      if (verification.code !== inputCode) {
        await verification.incrementAttempts();
        return { success: false, error: 'Invalid verification code' };
      }
      
      // Code is valid - mark as used
      await verification.markAsUsed();
      return { success: true, verification };
      
    } catch (error) {
      console.error('❌ Error verifying email code:', error.message);
      return { success: false, error: 'Verification failed' };
    }
  }
  
  // Verify WhatsApp code
  static async verifyWhatsAppCode(phoneNumber, inputCode) {
    try {
      const verification = await VerificationCodeMongo.findOne({
        phoneNumber,
        type: 'whatsapp',
        isUsed: false
      }).sort({ createdAt: -1 });
      
      if (!verification) {
        return { success: false, error: 'No verification code found for this phone number' };
      }
      
      if (!verification.isValid()) {
        if (verification.attempts >= 5) {
          return { success: false, error: 'Too many failed attempts. Please request a new code.' };
        }
        if (new Date() > verification.expiryTime) {
          return { success: false, error: 'Verification code has expired' };
        }
        return { success: false, error: 'Verification code is invalid' };
      }
      
      if (verification.code !== inputCode) {
        await verification.incrementAttempts();
        return { success: false, error: 'Invalid verification code' };
      }
      
      // Code is valid - mark as used
      await verification.markAsUsed();
      return { success: true, verification };
      
    } catch (error) {
      console.error('❌ Error verifying WhatsApp code:', error.message);
      return { success: false, error: 'Verification failed' };
    }
  }
  
  // Clean up expired codes (called periodically)
  static async cleanupExpiredCodes() {
    try {
      const result = await VerificationCodeMongo.deleteMany({
        $or: [
          { expiryTime: { $lt: new Date() } },
          { isUsed: true },
          { attempts: { $gte: 5 } }
        ]
      });
      
      console.log(`🧹 Cleaned up ${result.deletedCount} expired verification codes`);
      return result;
    } catch (error) {
      console.error('❌ Error cleaning up verification codes:', error.message);
      throw error;
    }
  }
  
  // Get verification stats
  static async getStats() {
    try {
      const totalCodes = await VerificationCodeMongo.countDocuments();
      const activeCodes = await VerificationCodeMongo.countDocuments({
        isUsed: false,
        expiryTime: { $gt: new Date() },
        attempts: { $lt: 5 }
      });
      const expiredCodes = await VerificationCodeMongo.countDocuments({
        $or: [
          { expiryTime: { $lt: new Date() } },
          { attempts: { $gte: 5 } }
        ]
      });
      
      return {
        totalCodes,
        activeCodes,
        expiredCodes,
        usedCodes: await VerificationCodeMongo.countDocuments({ isUsed: true })
      };
    } catch (error) {
      console.error('❌ Error getting verification stats:', error.message);
      throw error;
    }
  }
}

export default VerificationCodeMongo;