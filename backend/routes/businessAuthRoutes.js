import express from 'express';
import bcrypt from 'bcryptjs';
import { loginRateLimit, validateInput, validateEmail, validatePassword, sanitizeInput } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporary in-memory admin users storage (replace with database later)
let adminUsers = [
  {
    id: 1,
    email: 'leedennyps@gmail.com',
    password: '$2b$10$JKGR.ftU6PIPBgSOhk7j8.XTeIJOIJXUGgdHPDdLP2GRBQuFGcnPe', // hashed '11111111'
    firstName: 'Denny',
    lastName: 'Lee',
    role: 'admin',
    createdAt: new Date()
  }
];

// Admin login endpoint
router.post('/login', loginRateLimit, validateInput(['email', 'password']), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Admin login attempt for: ${email}`);
    
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }
    
    // Sanitize inputs
    const cleanEmail = sanitizeInput(email.toLowerCase());
    
    // Find admin user
    const adminUser = adminUsers.find(user => user.email.toLowerCase() === cleanEmail);
    
    if (!adminUser) {
      console.log(`❌ Admin user not found: ${cleanEmail}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, adminUser.password);
    
    if (!passwordMatch) {
      console.log(`❌ Invalid password for admin: ${cleanEmail}`);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // Create admin session
    req.session.userId = adminUser.id;
    req.session.email = adminUser.email;
    req.session.role = adminUser.role;
    req.session.isAdmin = true;
    
    console.log(`✅ Admin login successful: ${cleanEmail}`);
    
    // Return admin user info (without password)
    const { password: _, ...userWithoutPassword } = adminUser;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
});

// Get current admin user session
router.get('/me', (req, res) => {
  try {
    if (!req.session?.userId || !req.session?.isAdmin) {
      return res.status(401).json({ 
        error: 'Not authenticated as admin' 
      });
    }
    
    // Find admin user
    const adminUser = adminUsers.find(user => user.id === req.session.userId);
    
    if (!adminUser) {
      return res.status(401).json({ 
        error: 'Admin user not found' 
      });
    }
    
    // Return admin user info (without password)
    const { password: _, ...userWithoutPassword } = adminUser;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      session: {
        role: req.session.role,
        isAdmin: req.session.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Get admin session error:', error);
    res.status(500).json({ 
      error: 'Failed to get user session' 
    });
  }
});

// Admin logout endpoint
router.post('/logout', (req, res) => {
  try {
    if (req.session) {
      const email = req.session.email;
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ 
            error: 'Logout failed' 
          });
        }
        
        console.log(`🚪 Admin logout successful: ${email}`);
        res.json({ 
          success: true,
          message: 'Logout successful' 
        });
      });
    } else {
      res.json({ 
        success: true,
        message: 'No active session' 
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed' 
    });
  }
});

// Create new admin user (for setup - remove in production)
router.post('/create-admin', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        error: 'Admin creation not allowed in production' 
      });
    }
    
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }
    
    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: passwordValidation.message 
      });
    }
    
    // Check if admin already exists
    const existingAdmin = adminUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingAdmin) {
      return res.status(409).json({ 
        error: 'Admin with this email already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin
    const newAdmin = {
      id: adminUsers.length + 1,
      email: sanitizeInput(email.toLowerCase()),
      password: hashedPassword,
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      role: 'admin',
      createdAt: new Date()
    };
    
    adminUsers.push(newAdmin);
    
    console.log(`👤 New admin created: ${newAdmin.email}`);
    
    // Return admin info (without password)
    const { password: _, ...adminWithoutPassword } = newAdmin;
    
    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: adminWithoutPassword
    });
    
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      error: 'Failed to create admin user' 
    });
  }
});

// List all admin users (for development)
router.get('/admins', (req, res) => {
  try {
    // Only allow for authenticated admins
    if (!req.session?.isAdmin) {
      return res.status(401).json({ 
        error: 'Admin authentication required' 
      });
    }
    
    // Return all admins (without passwords)
    const adminsWithoutPasswords = adminUsers.map(({ password, ...admin }) => admin);
    
    res.json({
      success: true,
      admins: adminsWithoutPasswords,
      total: adminUsers.length
    });
    
  } catch (error) {
    console.error('List admins error:', error);
    res.status(500).json({ 
      error: 'Failed to list admin users' 
    });
  }
});

export default router;