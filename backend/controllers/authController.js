import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import validator from 'validator';

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Name, email, and password are required',
        code: 'MISSING_FIELDS',
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: 'User already exists',
        code: 'USER_EXISTS',
      });
    }

    // Optional: restrict role creation from frontend
    const allowedRoles = ['user']; // prevent signup as admin
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid role assignment',
        code: 'INVALID_ROLE',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user', // enforce default role
    });

    // Success response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to register user',
      code: 'SERVER_ERROR',
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: 'Email and password are required',
        code: 'MISSING_FIELDS',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Fetch user with password
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+password'
    );

    // Validate credentials
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Success response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to login user',
      code: 'SERVER_ERROR',
      error: error.message,
    });
  }
};
