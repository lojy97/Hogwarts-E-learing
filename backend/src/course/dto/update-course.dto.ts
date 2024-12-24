import * as mongoose from 'mongoose';

export class UpdateCourseDTO {
  title?: string;
  description?: string;
  category?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  isOutdated?: boolean; 
  createdBy?: mongoose.Types.ObjectId; 
  BeginnerCount?: number;
  IntermediateCount?: number;
  AdvancedCount?: number;
  isAvailable?:Boolean
  keywords?:Boolean;
  completed?: number;
  Avg?: number;
}
