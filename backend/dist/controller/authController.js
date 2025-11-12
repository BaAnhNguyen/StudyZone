"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
// Khởi tạo đăng nhập Google
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));
// Callback sau khi đăng nhập Google
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/login-failed'
}), (req, res) => {
    // Redirect về frontend Vite
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});
// Lấy thông tin user hiện tại
router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});
// Đăng xuất
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        // Xóa session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to destroy session'
                });
            }
            res.clearCookie('connect.sid'); // xóa cookie session
            res.json({
                success: true,
                message: 'Logged out successfully (Google/Session)'
            });
        });
    });
});
exports.default = router;
