import * as mongoose from 'mongoose';
export class UpdateCourseDTO {
    
    title?: string; 
    description?: string; 
    category?: string; 
    difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'; 
    createdBy?:mongoose.Schema.Types.ObjectId;
    createdAt?: Date; 
  }
