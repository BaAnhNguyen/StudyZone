import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user'; // Import model
import dotenv from 'dotenv'
dotenv.config()

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/oauth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user trong database
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Nếu đã có, cập nhật lastLogin
          user.lastLogin = new Date();
          await user.save(); // LƯU VÀO DATABASE
          return done(null, user);
        }

        // Nếu chưa có, tạo mới
        user = await User.create({ // LƯU VÀO DATABASE
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          lastLogin: new Date()
        });

        done(null, user);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;