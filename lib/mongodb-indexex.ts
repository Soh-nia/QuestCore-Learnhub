import connectMongoose from "./mongoose-connect"
import Course from "@/models/Course"
import User from "@/models/User"

// This function creates indexes for better query performance
export async function createMongoDBIndexes() {
    try {
        await connectMongoose()

        // Create indexes for Course collection
        await Course.collection.createIndex({ userId: 1 })
        await Course.collection.createIndex({ isPublished: 1 })
        await Course.collection.createIndex({ createdAt: -1 })

        // Create indexes for User collection
        await User.collection.createIndex({ enrolledCourses: 1 })

        console.log("MongoDB indexes created successfully")
    } catch (error) {
        console.error("Error creating MongoDB indexes:", error)
    }
}

// You can run this function during app initialization
// For example, in a setup script or in your app's entry point
