// ============= middleware/auth.middleware.ts =============
import { Request, Response, NextFunction } from 'express';

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
