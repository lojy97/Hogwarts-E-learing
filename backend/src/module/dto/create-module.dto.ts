import mongoose from "mongoose";

export class CreateModuleDTO {
  courseId: string;  
  title: string;
  content: string;
  resources?: string[];  
  difficulty: string;  
    quiz_id?: mongoose.Types.ObjectId; 
    questionBank_id?: mongoose.Types.ObjectId
}
