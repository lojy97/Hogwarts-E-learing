import * as mongoose from 'mongoose';
export class CreateCourseDTO {
  
  title: string; 
  description: string; 
  category: string; 
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  createdBy:mongoose.Types.ObjectId;
}

