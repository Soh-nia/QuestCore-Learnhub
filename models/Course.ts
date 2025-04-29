import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
    }],
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
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

courseSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

// Delete associated attachments, chapters, quizzes, and questions when a course is deleted
courseSchema.post('deleteOne', { document: true, query: false }, async function () {
    const quizIds = this.quizzes || [];
    await Promise.all([
        mongoose.model('Attachment').deleteMany({ courseId: this._id }),
        mongoose.model('Chapter').deleteMany({ courseId: this._id }),
        mongoose.model('Quiz').deleteMany({ courseId: this._id }),
        mongoose.model('Question').deleteMany({ quizId: { $in: quizIds } })
    ]);
});

courseSchema.post('deleteMany', { document: false, query: true }, async function () {
    const courses = await this.model.find(this.getQuery());
    const courseIds = courses.map(course => course._id);
    const quizIds = courses.flatMap(course => course.quizzes || []);
    await Promise.all([
        mongoose.model('Attachment').deleteMany({ courseId: { $in: courseIds } }),
        mongoose.model('Chapter').deleteMany({ courseId: { $in: courseIds } }),
        mongoose.model('Quiz').deleteMany({ courseId: { $in: courseIds } }),
        mongoose.model('Question').deleteMany({ quizId: { $in: quizIds } })
    ]);
});

// Prevent model recompilation in development
export default mongoose.models.Course || mongoose.model('Course', courseSchema);