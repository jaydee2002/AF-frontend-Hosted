import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// === Winston Logger Setup ===
winston.configure({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/server.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
});

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Request Logger Middleware ===
app.use((req, res, next) => {
  winston.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// === MongoDB Connection ===
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      w: 'majority',
    });
    winston.info('MongoDB connected');
  } catch (err) {
    winston.error('MongoDB connection error: ' + err.message);
    process.exit(1);
  }
};
connectDB();

// === Routes ===
app.get('/', (req, res) => {
  res.status(200).json({ message: 'User Service Running', status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// === Centralized Error Handler ===
app.use((err, req, res, next) => {
  winston.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// === Start Server ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  winston.info(`User Service running on port ${PORT}`);
});
