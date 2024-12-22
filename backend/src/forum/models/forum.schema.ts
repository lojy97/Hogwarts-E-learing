import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Thread } from '../../threads/models/threads.schema';

export type ForumDocument = HydratedDocument<Forum>;

@Schema({ timestamps: true })
export class Forum {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  moderator: MongooseSchema.Types.ObjectId;

  // Store references to threads
  @Prop({
    type: [
      {
        threadId: { type: MongooseSchema.Types.ObjectId, ref: 'Thread' },
        title: String,
        creator: { type: MongooseSchema.Types.ObjectId, ref: 'User' }, // Add the creator field
        replies: {
          type: [
            {
              replyId: { type: MongooseSchema.Types.ObjectId },
              content: String,
              author: String,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  })
  threads: {
    threadId: string;
    title: string;
    creator: string; // Add the creator field
    replies: { replyId: string; content: string; author: string }[];
  }[];
}

export const ForumSchema = SchemaFactory.createForClass(Forum);