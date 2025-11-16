import jwt from 'jsonwebtoken';

export interface JWTPayload {
    userId: string;
    role_code: string;
}

export class JWTUtils {
    private static readonly JWT_EXPIRES_IN = '7d'; // 7 ngày

    // Hàm helper để lấy JWT_SECRET mỗi lần gọi
    private static getSecret(): string {
        return process.env.JWT_SECRET || 'my-secret-key-change-in-production';
    }

    /**
     * Tạo access token
     */
    public static generateAccessToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.getSecret(), {
            expiresIn: this.JWT_EXPIRES_IN,
            algorithm: 'HS256'
        });
    }

    /**
     * Verify và decode token
     */
    public static verifyToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, this.getSecret()) as JWTPayload;
            return decoded;          
        } catch (error) {
            console.error('JWT verification error:', error);
            return null;
        }
    }

    /**
     * Decode token không verify (để lấy thông tin khi token expired)
     */
    public static decodeToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.decode(token) as JWTPayload;
            return decoded;
        } catch (error) {
            console.error('JWT decode error:', error);
            return null;
        }
    }

    public static generateVerificationToken(payload: any): string {
        const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET || 'verification_secret_key';
        return jwt.sign(payload, secret, {
            expiresIn: '24h',
            algorithm: 'HS256'
        });
    }

    /**
     * Verify verification token
     */
    public static verifyVerificationToken(token: string): any {
        try {
            const secret = process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET || 'verification_secret_key';
            return jwt.verify(token, secret);
        } catch (error) {
            console.error('Verification token error:', error);
            return null;
        }
    }
    
    public static generateResetPasswordToken(payload: { email: string; userId: string }): string {
        const secret = process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET || 'reset_password_secret';
        return jwt.sign(payload, secret, {
            expiresIn: '1h',
            algorithm: 'HS256'
        });
    }

    /**
     * Verify reset password token
     */
    public static verifyResetPasswordToken(token: string): { email: string; userId: string } | null {
        try {
            const secret = process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET || 'reset_password_secret';
            return jwt.verify(token, secret) as { email: string; userId: string };
        } catch (error) {
            console.error('Reset password token error:', error);
            return null;
        }
    }
} 