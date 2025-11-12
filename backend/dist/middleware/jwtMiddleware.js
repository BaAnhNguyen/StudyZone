"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtUtil_1 = require("../utils/jwtUtil");
/**
 * Middleware xác thực JWT token
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token là bắt buộc'
        });
        return;
    }
    const decoded = jwtUtil_1.JWTUtils.verifyToken(token);
    if (!decoded) {
        res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
        return;
    }
    // Đảm bảo req.jwtUser được gán đúng cách
    req.jwtUser = decoded;
    // Compatibility: cũng set req.user cho các code cũ
    req.user = decoded;
    next();
};
exports.authenticateToken = authenticateToken;
