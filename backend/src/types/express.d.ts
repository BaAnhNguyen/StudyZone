import { IUser } from "../models/user.model.js";

declare global {
  namespace Express {
    interface User extends IUser {}
    
    interface Request {
      logout(callback: (err: any) => void): void;
    }
  }
}

export {};
