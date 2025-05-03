import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import connectMongoose from '@/lib/mongoose-connect';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { auth } from '@/auth';

interface QuestionLean {
    _id: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    text: string;
    options: string[];
    correctAnswer: number;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}

interface Params {
    quizId: string;
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'instructor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectMongoose();

        // Await the params to resolve the Promise
        const params = await context.params;
        const quiz = await Quiz.findById(params.quizId);
        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        const questions = await Question.find({ quizId: params.quizId }).lean() as QuestionLean[];

        return NextResponse.json({
            quiz: {
                _id: quiz._id.toString(),
                courseId: quiz.courseId.toString(),
                title: quiz.title,
                isRequiredForCompletion: quiz.isRequiredForCompletion,
                createdAt: quiz.createdAt,
                updatedAt: quiz.updatedAt,
            },
            questions: questions.map((q: QuestionLean) => ({
                _id: q._id.toString(),
                quizId: q.quizId.toString(),
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                createdAt: q.createdAt,
                updatedAt: q.updatedAt,
            })),
        });
    } catch (error) {
        console.error('GET /api/quizzes/[quizId] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}