"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/StudyZone';
        await mongoose_1.default.connect(mongoUri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const closeDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB is closed!');
    }
    catch (error) {
        console.error('MongoDB closed error:', error);
        throw error;
    }
};
exports.closeDatabase = closeDatabase;
