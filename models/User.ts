import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    image: { type: String, required: false },
    role: { type: String, enum: ['instructor', 'student'], required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model('User', userSchema);
