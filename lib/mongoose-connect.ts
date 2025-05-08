import mongoose from "mongoose"

// Cache the mongoose connection
let cachedConnection: typeof mongoose | null = null
let connectionPromise: Promise<typeof mongoose> | null = null

export default async function connectMongoose() {
    if (cachedConnection) {
        return cachedConnection
    }

    if (connectionPromise) {
        return connectionPromise
    }

    if (mongoose.connection.readyState === 1) {
        cachedConnection = mongoose
        return cachedConnection
    }

    // Set up connection options for better performance
    const options = {
        maxPoolSize: 20, // Increase connection pool size
        minPoolSize: 10, // Maintain minimum connections
        socketTimeoutMS: 45000, // Increase timeout
        serverSelectionTimeoutMS: 30000,
        family: 4, // Use IPv4, skip trying IPv6
        connectTimeoutMS: 10000, // Reduce connection timeout
        bufferCommands: true, // Buffer commands when connection is lost
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI

        if (!MONGODB_URI) {
            throw new Error("Please define the MONGODB_URI environment variable")
        }

        // Create a connection promise
        connectionPromise = mongoose.connect(MONGODB_URI, options)

        // Wait for the connection
        cachedConnection = await connectionPromise
        connectionPromise = null

        console.log("MongoDB connected successfully")
        return cachedConnection
    } catch (error) {
        connectionPromise = null
        console.error("MongoDB connection error:", error)
        throw error
    }
}
