// ============= middleware/auth.middleware.ts =============
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware chỉ cho phép Session-based authentication (Google OAuth)
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: 'Unauthorized. Please login.'
  });
};

/**
 * Middleware cho phép cả JWT token và Session-based authentication
 * Sử dụng cho routes cần hỗ trợ cả 2 loại authentication (view/update profile)
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // 1. Kiểm tra Sessio-based auth (Google OAuth) trước
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }

  // 2. Nếu không có session, kiểm tra JWT token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token hoặc session là bắt buộc'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'my-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Gán user vào request để sử dụng ở các middleware/controller tiếp theo
    req.user = decoded;
    (req as any).jwtUser = decoded; // Cũng set jwtUser cho compatibility
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

