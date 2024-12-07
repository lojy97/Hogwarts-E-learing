import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Course } from '../../course/models/course.schema';
import { Module } from '../../module/models/module.schema';
import { User } from '../../user/models/user.schema';
import { Thread } from '../../threads/models/threads.schema';

export type ForumDocument = HydratedDocument<Forum>;

@Schema({ timestamps: true })
export class Forum {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: false })
  course: Course;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Module', required: false })
  module?: Module;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  moderator: User;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Thread', default: [] })
  threads: Thread[];
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
