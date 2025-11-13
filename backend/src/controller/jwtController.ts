import { Router, Request, Response } from 'express';
import User from '../models/user';
import { JWTUtils } from '../utils/jwtUtil';
import { authenticateToken } from '../middleware/jwtMiddleware';

const router = Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password và tên là bắt buộc'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const user = new User({
      email,
      password,
      name,
      isEmailVerified: false
    });

    await user.save();

    // Tạo verification token (tùy chọn - để xác thực email)
    const verificationToken = JWTUtils.generateVerificationToken({
      userId: user._id.toString(),
      email: user.email
    });

    // TODO: Gửi email xác thực (implement sau)
    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
});

/**
 * POST /api/auth/login
 * Đăng nhập bằng email/password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }

    // Tìm user (cần select password vì đã set select: false)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra account active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Cập nhật lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Tạo JWT token
    const accessToken = JWTUtils.generateAccessToken({
      userId: user._id.toString(),
      role_code: user.role || 'user'
    });

    // Trả về thông tin user (không bao gồm password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: userResponse,
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
});

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần JWT token)
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.jwtUser?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin user'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user'
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Xác thực email
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token xác thực là bắt buộc'
      });
    }

    const decoded = JWTUtils.verifyVerificationToken(token);
    
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }


    await user.save();

    res.json({
      success: true,
      message: 'Xác thực email thành công'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực email'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Quên mật khẩu - gửi email reset
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      // Không tiết lộ email có tồn tại hay không (security)
      return res.json({
        success: true,
        message: 'Nếu email tồn tại, link reset password đã được gửi'
      });
    }

    const resetToken = JWTUtils.generateResetPasswordToken({
      email: user.email,
      userId: user._id.toString()
    });

    // TODO: Gửi email reset password
    // await sendResetPasswordEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'Nếu email tồn tại, link reset password đã được gửi',
      // REMOVE THIS IN PRODUCTION - chỉ để test
      devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý quên mật khẩu'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset mật khẩu
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    const decoded = JWTUtils.verifyResetPasswordToken(token);
    
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi reset mật khẩu'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Đổi mật khẩu (khi đã đăng nhập)
 */
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.jwtUser?.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user || !user.password) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại hoặc không có mật khẩu'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đổi mật khẩu'
    });
  }
});

/**
 * POST /api/auth/reset-password-by-email
 * Đặt lại mật khẩu bằng email (không cần token)
 */
router.post('/reset-password-by-email', async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu mới là bắt buộc'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Đặt lại mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    console.error('Reset password by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đặt lại mật khẩu'
    });
  }
});
/**
 * POST /api/auth/logout
 * Đăng xuất JWT (client sẽ xóa token)
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.jwtUser?.userId;

    if (userId) {
      // Có thể log việc logout hoặc invalidate token ở đây
      console.log(`User ${userId} logged out at ${new Date().toISOString()}`);
      
      // Nếu có session (trường hợp mixed auth), xóa session
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('Session destroy error:', err);
          }
        });
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully (JWT)'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất'
    });
  }
});

export default router;