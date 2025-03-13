
import mongoose from "mongoose";

let isConnected = false;

export const connectMongodb = async () => {
    try {
        if (isConnected) return mongoose.connection;

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;
        console.log("MongoDB connected successfully");
        
        return mongoose.connection;
    } catch (error) {
        throw error;
    }
};

