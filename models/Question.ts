import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

questionSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

export default mongoose.models.Question || mongoose.model('Question', questionSchema);