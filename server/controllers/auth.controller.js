// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const admin = require('../config/firebase');

// Register a new user
exports.register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered. Please log in instead.' });
    }

    // Create user in Firebase
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });
    } catch (firebaseError) {
      console.error('Firebase user creation error:', firebaseError);
      return res.status(400).json({ message: firebaseError.message || 'Failed to create user in Firebase' });
    }

    // Create new user in MongoDB
    let user;
    try {
      user = await User.create({
        username,
        email,
        password, // Password will be hashed in the pre-save hook
        firstName,
        lastName,
        firebaseUid: userRecord.uid
      });
    } catch (mongoError) {
      // Rollback Firebase user if MongoDB creation fails
      try {
        await admin.auth().deleteUser(userRecord.uid);
        console.error('Rolled back Firebase user due to MongoDB error.');
      } catch (rollbackError) {
        console.error('Failed to rollback Firebase user:', rollbackError);
      }
      console.error('MongoDB user creation error:', mongoError);
      return res.status(500).json({ message: 'Failed to create user in database', error: mongoError.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'jwt-secret-key',
      { expiresIn: '1d' }
    );

    // Set session
    req.session.userId = user._id;

    // Set JWT as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'jwt-secret-key',
      { expiresIn: '1d' }
    );

    // Set session
    req.session.userId = user._id;

    // Set JWT as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify Firebase token
exports.verifyFirebaseToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      console.error('No ID token provided in request body');
      return res.status(401).json({ message: 'No ID token provided' });
    }

    console.log('Attempting to verify Firebase token...');
    
    // Verify the Firebase ID token with additional options
    const decodedToken = await admin.auth().verifyIdToken(idToken, true); // true for checking if token is revoked
    console.log('Token verified successfully:', {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
      auth_time: decodedToken.auth_time,
      exp: decodedToken.exp
    });
    
    const firebaseUid = decodedToken.uid;
    console.log('Firebase UID:', firebaseUid);

    // Get user info from Firebase
    const userRecord = await admin.auth().getUser(firebaseUid);
    console.log('Firebase user record:', {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      emailVerified: userRecord.emailVerified
    });

    // Find user by firebaseUid, email, or username
    let user = await User.findOne({
      $or: [
        { firebaseUid },
        { email: userRecord.email },
        { username: userRecord.displayName || userRecord.email.split('@')[0] }
      ]
    });
    console.log('Existing user found:', !!user);

    if (!user) {
      // Create new user in MongoDB
      user = await User.create({
        email: userRecord.email,
        username: userRecord.displayName || userRecord.email.split('@')[0],
        firstName: userRecord.displayName?.split(' ')[0] || '',
        lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || '',
        firebaseUid: userRecord.uid,
        password: Math.random().toString(36).slice(-8) // Random password since user will use Firebase to login
      });
      console.log('New user created in MongoDB:', user._id);
    } else if (!user.firebaseUid) {
      // Link firebaseUid if not already set
      user.firebaseUid = firebaseUid;
      await user.save();
      console.log('Linked firebaseUid to existing user:', user._id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        firebaseUid: user.firebaseUid
      },
      process.env.JWT_SECRET || 'jwt-secret-key',
      { expiresIn: '1d' }
    );

    // Set session
    req.session.userId = user._id;

    // Set JWT as cookie with additional options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: 'Firebase authentication successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Firebase token verification error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Send more detailed error response
    res.status(401).json({ 
      message: 'Invalid Firebase token', 
      error: error.message,
      code: error.code,
      details: error.details || 'No additional details available'
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  try {
    // Clear session
    req.session.destroy();

    // Clear JWT cookie
    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // Set by auth middleware

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};