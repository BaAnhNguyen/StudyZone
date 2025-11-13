import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Khởi tạo đăng nhập Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })
);

// Callback sau khi đăng nhập Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed'
  }),
  (req, res) => {
    // Redirect về frontend với query param để trigger checkAuth
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}?auth=success`);
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


export default router;
