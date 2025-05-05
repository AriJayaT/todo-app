// services/authService.js
const { User, Session, PasswordReset, UserSetting } = require('../db/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * Service to handle all authentication-related operations using Sequelize ORM
 * This replaces the Firebase Authentication implementation
 */
class AuthService {
  /**
   * Register a new user with email and password
   * @param {string} name - User's display name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Promise resolving to user data and token
   */
  static async registerWithEmailAndPassword(name, email, password) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Generate a UID (similar to Firebase)
      const uid = crypto.randomUUID();
      
      // Create user record
      const user = await User.create({
        uid,
        name,
        email,
        auth_provider: 'local',
        photo_url: null
      });
      
      // Create user settings
      await UserSetting.create({
        user_id: uid,
        theme: 'dark',
        notification_enabled: false
      });
      
      // Generate authentication token
      const token = this.generateToken(user);
      
      // Store session
      await this.createSession(uid, token);
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
  
  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Promise resolving to user data and token
   */
  static async loginWithEmailAndPassword(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }
      
      // Generate authentication token
      const token = this.generateToken(user);
      
      // Store session
      await this.createSession(user.uid, token);
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
  
  /**
   * Simulate Google sign-in
   * In a real implementation, this would verify the Google token
   * @param {Object} googleUser - Google user data
   * @returns {Promise<Object>} - Promise resolving to user data and token
   */
  static async loginWithGoogle(googleUser) {
    try {
      // Extract user info from Google response
      const { email, name, picture } = googleUser;
      
      // Check if user exists
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Create new user if they don't exist
        const uid = crypto.randomUUID();
        
        user = await User.create({
          uid,
          name,
          email,
          auth_provider: 'google',
          photo_url: picture
        });
        
        // Create user settings
        await UserSetting.create({
          user_id: uid,
          theme: 'dark',
          notification_enabled: false
        });
      }
      
      // Generate authentication token
      const token = this.generateToken(user);
      
      // Store session
      await this.createSession(user.uid, token);
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      console.error('Error with Google login:', error);
      throw error;
    }
  }
  
  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  static async sendPasswordReset(email) {
    try {
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Set expiration (1 hour from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      
      // Store reset token
      await PasswordReset.create({
        email,
        token: resetToken,
        expires_at: expiresAt
      });
      
      // Send email with reset link
      const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
      
      // Configure email transporter (replace with your SMTP settings)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      
      // Send email
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset for your SpaceApp account.</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetLink}">Reset Password</a>
        `
      });
      
      return true;
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  }
  
  /**
   * Logout user by invalidating session
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} - Promise resolving to success status
   */
  static async logout(token) {
    try {
      // Delete session from database
      const deleted = await Session.destroy({
        where: { token }
      });
      
      return deleted > 0;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
  
  /**
   * Create a new session
   * @param {string} userId - User ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} - Promise resolving to created session
   */
  static async createSession(userId, token) {
    try {
      // Set expiration (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Create session record
      const session = await Session.create({
        user_id: userId,
        token,
        expires_at: expiresAt
      });
      
      return session.toJSON();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }
  
  /**
   * Verify authentication token and return user
   * @param {string} token - Authentication token
   * @returns {Promise<Object|null>} - Promise resolving to user data or null if invalid
   */
  static async verifyToken(token) {
    try {
      // Check if token exists in database and is not expired
      const session = await Session.findOne({
        where: {
          token,
          expires_at: {
            [Op.gt]: new Date() // Greater than current time
          }
        }
      });
      
      if (!session) return null;
      
      // Get user associated with session
      const user = await User.findOne({
        where: { uid: session.user_id }
      });
      
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
  
  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  static generateToken(user) {
    const payload = {
      uid: user.uid,
      email: user.email
    };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }
}

module.exports = AuthService;