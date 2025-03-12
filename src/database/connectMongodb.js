import { MongoClient } from "mongodb";

global.mongoDBClient = null;

export const connectMongodb = async () => {
    try {
        if (global.mongoDBClient) {
            return global.mongoDBClient.db(process.env.DB_NAME);
        }
    
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();
        global.mongoDBClient = client;

        console.log("MongoDB connected successfully");
        
        return client.db(process.env.DB_NAME); 
    } catch (error) {
        throw error;
    }
};
