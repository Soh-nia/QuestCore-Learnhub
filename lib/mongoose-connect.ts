import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
}

const connectMongoose = async () => {
    try {
        if (cached.conn) {
            console.log('Using cached MongoDB connection');
            return cached.conn;
        }

        if (!cached.promise) {
            console.log('Creating new MongoDB connection');
            const opts = {
                bufferCommands: false,
            };

            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                console.log('Connected to MongoDB Atlas via Mongoose');
                console.log('Registered models:', Object.keys(mongoose.models));
                return mongoose;
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error('Mongoose connection error:', error);
        cached.promise = null;
        throw new Error(`Failed to connect to MongoDB: ${error}`);
    }
};

export default connectMongoose;