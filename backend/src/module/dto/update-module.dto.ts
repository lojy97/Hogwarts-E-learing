import mongoose from "mongoose";

export class UpdateModuleDTO {
  courseId?: string;
  title?: string;
  content?: string;
  resources?: string[];
  difficulty?: string;  
    quiz_id?: mongoose.Types.ObjectId; 
}
