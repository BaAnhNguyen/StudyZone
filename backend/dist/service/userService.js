"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const userRepository_1 = require("../repository/userRepository");
const mongoose_1 = __importDefault(require("mongoose"));
class userService {
    static async updateProfile(id, data) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Id không tồn tại');
        }
        const user = await userRepository_1.UserRepository.findById(id);
        if (!user) {
            throw new Error('User không tồn tại');
        }
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.phone)
            updateData.phone = data.phone;
        if (data.avatar)
            updateData.avatar = data.avatar;
        if (Object.keys(updateData).length === 0) {
            throw new Error('Không có data để update');
        }
        const updatedUser = await userRepository_1.UserRepository.updateById(id, updateData);
        return updatedUser;
    }
    static async getUserProfile(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Id không tồn tại');
        }
        const user = await userRepository_1.UserRepository.findById(id);
        if (!user) {
            throw new Error('User không tồn tại');
        }
        return user;
    }
}
exports.userService = userService;
