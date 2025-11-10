import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/StudyZone';

        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const closeDatabase = async(): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB is closed!')
    } catch (error) {
        console.error('MongoDB closed error:', error);
        throw error;
    }
}