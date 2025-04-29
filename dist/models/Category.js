import mongoose from 'mongoose';
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Update updatedAt only on document modification
categorySchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});
// Prevent model recompilation in development
export default mongoose.models.Category || mongoose.model('Category', categorySchema);
