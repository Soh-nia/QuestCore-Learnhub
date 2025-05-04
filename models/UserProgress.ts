import mongoose, { Schema } from 'mongoose';

const userProgressSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    quizResults: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userProgressSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

export default mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);