// MongoDB configuration and connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection configuration
const getMongoURI = () => {
  // Railway production will inject MONGO_URL automatically
  if (process.env.MONGO_URL) {
    console.log('🔗 Using Railway MongoDB connection');
    return process.env.MONGO_URL;
  }
  
  // Fallback to local MongoDB for development
  if (process.env.MONGODB_URI) {
    console.log('🔗 Using local MongoDB connection');
    return process.env.MONGODB_URI;
  }
  
  console.log('⚠️ No MongoDB connection string found - using fallback storage');
  return null;
};

let isConnected = false;

// Connect to MongoDB
export const connectMongoDB = async () => {
  if (isConnected) {
    console.log('📦 MongoDB already connected');
    return;
  }

  const mongoURI = getMongoURI();
  
  if (!mongoURI) {
    console.log('💡 MongoDB not available - will use fallback storage');
    return false;
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Will use fallback storage for this session');
    return false;
  }
};

// Test MongoDB connection
export const testMongoConnection = async () => {
  try {
    const connected = await connectMongoDB();
    
    if (!connected) {
      return {
        success: false,
        message: 'MongoDB not available - using fallback storage'
      };
    }
    
    // Test with a simple query
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    
    return {
      success: true,
      message: 'MongoDB connection successful',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Export mongoose for use in models
export { mongoose };