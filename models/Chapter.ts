import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: false,
        trim: true,
    },
    position: {
        type: Number,
        required: true,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

chapterSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

// Prevent model recompilation in development
export default mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);