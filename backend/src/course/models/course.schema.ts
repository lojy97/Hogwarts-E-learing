import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficultyLevel: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false }) // New flag for outdated status
  isOutdated: boolean;

  @Prop({ default: 0 }) // Number of ratings received
  ratingCount: number;

  @Prop({ default: 0 }) // Average rating value
  averageRating: number;

  @Prop({ default: 0 })
  BeginnerCount: number;

  @Prop({ default: 0 })
  IntermediateCount: number;

  @Prop({ default: 0 })
  AdvancedCount: number;

}

export const CourseSchema = SchemaFactory.createForClass(Course);
