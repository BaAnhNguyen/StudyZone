import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import { required } from 'joi';

export interface IUser extends Document {
  _id: ObjectId;
  googleId?: string; // Optional vì có thể đăng ký bằng email/password
  password?: string; // Optional vì có thể đăng nhập bằng Google
  email: string;
  name: string;
  phone:string;
  avatar?: string;
  role?: 'user' | 'admin';
  total_card?: Number,
  isActive?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    googleId: {
      type: String,
      sparse: true, // Cho phép null/undefined, nhưng unique nếu có giá trị
      index: true
    },
    password: {
      type: String,
      select: false // Không trả về password khi query
    },
    phone : {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    total_card: {
      type: Number,
      required: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password trước khi save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  }
  next();
});

// Method so sánh password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password as string);
};

export default mongoose.model<IUser>('User', UserSchema, 'User');