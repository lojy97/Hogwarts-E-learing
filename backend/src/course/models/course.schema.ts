import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficultyLevel: string;

  @Prop({ required: true })
  createdBy: string; 

  @Prop({ default: Date.now })
  createdAt: Date; 
}

export const CourseSchema = SchemaFactory.createForClass(Course);
