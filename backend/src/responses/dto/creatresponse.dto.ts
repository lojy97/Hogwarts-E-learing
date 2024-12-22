import mongoose from "mongoose";

export class CreateResponseDto {
   
   
    user_id:  mongoose.Types.ObjectId;;
  
   
    quiz_id:  mongoose.Types.ObjectId;;
  
   
    answers: {
      questionId: string;
      answer: string;
    }[];
    submittedAt: Date;
    nextLevel: boolean;
    correctAnswersI:number[];
    score: number;
      pass: boolean;
  }