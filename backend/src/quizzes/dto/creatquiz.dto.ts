import mongoose, { HydratedDocument } from 'mongoose';
export class createQuizDTo {
    Module_id: mongoose.Types.ObjectId;
    questionsITF:[number];
    questionsIMCQ:[number];
    created_at: Date;
    quizQuestions: { question: string; correctAnswer: string }[];

  }