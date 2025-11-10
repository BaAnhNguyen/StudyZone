import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Khởi tạo đăng nhập Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback sau khi đăng nhập Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed'
  }),
  (req, res) => {
    // Redirect về frontend Vite
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// Lấy thông tin user hiện tại
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
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
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

export default router;
