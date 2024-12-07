import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Thread } from '../../threads/models/threads.schema';
import { User } from '../../user/models/user.schema';

export type ReplyDocument = HydratedDocument<Reply>;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Thread', required: true })
  thread: Thread;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: String, required: true })
  content: string;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
