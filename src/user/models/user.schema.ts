import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from '../../course/models/course.schema';
import * as bcrypt from 'bcrypt';

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

  @Prop({ required: true, enum: UserRole, default: UserRole.Student})
  role: UserRole;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  courses: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware to hash the password before saving the user document
UserSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});