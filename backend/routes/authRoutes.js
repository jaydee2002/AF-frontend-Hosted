import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Only 5 attempts
  message: 'Too many login/register attempts. Please try again later.',
});

router.post('/login', authLimiter, loginUser);
router.post('/register', authLimiter, registerUser);

export default router;
