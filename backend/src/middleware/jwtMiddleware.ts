import { Request, Response, NextFunction } from 'express';
import { JWTUtils, JWTPayload } from '../utils/jwtUtil';


// Extend Express Request interface để thêm user info
declare global {
    namespace Express {
        interface Request {
            jwtUser?: JWTPayload;
        }
    }
}

/**
 * Middleware xác thực JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access token là bắt buộc'
        });
        return;
    }

    const decoded = JWTUtils.verifyToken(token);

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
    (req as any).user = decoded;
    next();
};