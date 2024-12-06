import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from '../../course/models/course.schema';

export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}

@Schema({ timestamps: true }) // Enable timestamps
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.Student })
  role: UserRole;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  courses:  mongoose.Types.ObjectId[];;
}

export const UserSchema = SchemaFactory.createForClass(User);