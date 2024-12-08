import mongoose, { HydratedDocument } from 'mongoose';
export class createQuizDTo {
    Module_id: mongoose.Types.ObjectId;
    MCQ:number;
    TF:number;
    created_at: Date;
    quizQuestions: {id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];

  }