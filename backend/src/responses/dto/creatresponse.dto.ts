import mongoose from "mongoose";

export class CreateResponseDto {
   
   
    user_id:  mongoose.Types.ObjectId;;
  
   
    quiz_id:  mongoose.Types.ObjectId;;
  
   
    answers: {
      questionId: string;
      answer: string;
    }[];
    submittedAt: Date;
  
   
    score: number;
  }