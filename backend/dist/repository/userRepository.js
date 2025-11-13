"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserRepository {
    static async findById(id) {
        return user_1.default.findById(id).select("-password");
    }
    static async updateById(id, updateData) {
        return user_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-password");
    }
}
exports.UserRepository = UserRepository;
