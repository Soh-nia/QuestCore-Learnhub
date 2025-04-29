import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    isRequiredForCompletion: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

quizSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);