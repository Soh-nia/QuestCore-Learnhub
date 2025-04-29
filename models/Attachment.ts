import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

attachmentSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

// Prevent model recompilation in development
export default mongoose.models.Attachment || mongoose.model('Attachment', attachmentSchema);