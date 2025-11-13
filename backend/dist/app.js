"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = __importDefault(require("./controller/userController"));
// Import routes
const authController_1 = __importDefault(require("../src/controller/authController")); // Google OAuth routes
const jwtController_1 = __importDefault(require("../src/controller/jwtController")); // JWT routes
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session config (cho Google OAuth)
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use('/api/auth', jwtController_1.default); // JWT authentication
app.use('/api/oauth', authController_1.default); // Google OAuth (tách riêng để tránh conflict)
app.use('/api/user', userController_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
exports.default = app;
