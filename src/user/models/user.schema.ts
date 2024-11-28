import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from '../../course/models/course.schema';

export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}

@Schema()
export class User {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  courses: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);