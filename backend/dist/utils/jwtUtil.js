"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTUtils {
    /**
     * Tạo access token
     */
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
            algorithm: 'HS256'
        });
    }
    /**
     * Verify và decode token
     */
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            console.error('JWT verification error:', error);
            return null;
        }
    }
    /**
     * Decode token không verify (để lấy thông tin khi token expired)
     */
    static decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded;
        }
        catch (error) {
            console.error('JWT decode error:', error);
            return null;
        }
    }
    static generateVerificationToken(payload) {
        const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET || 'verification_secret_key';
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: '24h',
            algorithm: 'HS256'
        });
    }
    /**
     * Verify verification token
     */
    static verifyVerificationToken(token) {
        try {
            const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET || 'verification_secret_key';
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            console.error('Verification token error:', error);
            return null;
        }
    }
    static generateResetPasswordToken(payload) {
        const secret = process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET || 'reset_password_secret';
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: '1h',
            algorithm: 'HS256'
        });
    }
    /**
     * Verify reset password token
     */
    static verifyResetPasswordToken(token) {
        try {
            const secret = process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET || 'reset_password_secret';
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            console.error('Reset password token error:', error);
            return null;
        }
    }
}
exports.JWTUtils = JWTUtils;
JWTUtils.JWT_SECRET = process.env.JWT_SECRET ?? 'my-secret-key-change-in-production';
JWTUtils.JWT_EXPIRES_IN = '7d'; // 7 ngày
