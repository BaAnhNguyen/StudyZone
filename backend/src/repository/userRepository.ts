import User from "../models/user";
import { IUser } from "../models/user";

export class UserRepository {
  public static async findById(id: string) {
    return User.findById(id).select("-password");
  }

  public static async updateById(id: string, updateData: Partial<IUser>) {
    return User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
}
}


