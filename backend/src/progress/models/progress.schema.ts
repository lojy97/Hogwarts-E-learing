import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type progressDocument= HydratedDocument<Progress>
@Schema()
export class Progress {
  @Prop({ required: true })
  progress_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true, min: 0, max: 100  })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;

  @Prop({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  performanceMetric: string;
 
  
  

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);