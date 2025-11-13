"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_1 = __importDefault(require("../models/user")); // Import model
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/oauth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Tìm user trong database
        let user = await user_1.default.findOne({ googleId: profile.id });
        if (user) {
            // Nếu đã có, cập nhật lastLogin
            user.lastLogin = new Date();
            await user.save(); // LƯU VÀO DATABASE
            return done(null, user);
        }
        // Nếu chưa có, tạo mới
        user = await user_1.default.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            lastLogin: new Date()
        });
        done(null, user);
    }
    catch (error) {
        console.error('Error in Google Strategy:', error);
        done(error, undefined);
    }
}));
exports.default = passport_1.default;
