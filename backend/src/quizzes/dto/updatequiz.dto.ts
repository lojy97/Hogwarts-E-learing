import mongoose, { HydratedDocument } from 'mongoose';
export class UpdateQuizDto {
  MCQ:number;
    TF:number;
  created_at?: Date;
  quizQuestions?: {id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];
  ratingsc?: Number;
  avgRating?: Number;
  }