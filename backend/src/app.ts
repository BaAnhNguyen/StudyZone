import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import userController from './controller/userController'

// Import routes
import authController from '../src/controller/authController'; // Google OAuth routes
import jwtAuthController from '../src/controller/jwtController'; // JWT routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config (cho Google OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport initialization (cho Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', jwtAuthController); // JWT authentication
app.use('/api/oauth', authController); // Google OAuth (tách riêng để tránh conflict)
app.use('/api/user', userController)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;