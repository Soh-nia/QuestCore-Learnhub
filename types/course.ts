import mongoose from 'mongoose';

export interface AttachmentI {
    _id: string;
    name: string;
    url: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChapterI {
    _id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizI {
    _id: string;
    courseId: string;
    title: string;
    isRequiredForCompletion: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionI {
    _id: string;
    quizId: string;
    text: string;
    options: string[];
    correctAnswer: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseI {
    _id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    price: number | null;
    isPublished: boolean;
    categoryId: string | null;
    categoryName: string | null;
    userId: string;
    quizzes: QuizI[];
    chapters: ChapterI[];
    attachments: AttachmentI[];
    createdAt: Date;
    updatedAt: Date;
}

export interface RawCourse {
    _id: { toString: () => string };
    userId: { toString: () => string };
    title: string;
    description?: string | null;
    imageUrl: string;
    price?: number | null;
    isPublished: boolean;
    categoryId?: { toString: () => string; name: string } | null;
    chapters: (ChapterI & { courseId: mongoose.Types.ObjectId })[];
    quizzes: QuizI[];
    attachments: AttachmentI[]
    createdAt: Date;
    updatedAt: Date;
}

export interface RawCourseHome {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    userId: {
        _id: mongoose.Types.ObjectId;
        name: string;
        image: string | null;
    } | null;
    categoryId: mongoose.Types.ObjectId;
    chapters: {
        _id: mongoose.Types.ObjectId;
        title: string;
    }[];
    __v?: number;
}

export interface RawCategory {
    _id: mongoose.Types.ObjectId;
    name: string;
    __v?: number;
}