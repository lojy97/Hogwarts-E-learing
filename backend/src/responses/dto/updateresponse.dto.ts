import mongoose from "mongoose";

export class UpdateResponseDto {
    
    user_id?: mongoose.Types.ObjectId;
 
    quiz_id?:  mongoose.Types.ObjectId;

    answers?: {
      question_id: string;
      answer: string;
    }[];
  
    nextLevel?: boolean;
    score?: number;
    correctAnswersI?:number[];
    pass?: boolean;
  }