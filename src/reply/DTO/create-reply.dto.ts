import * as mongoose from 'mongoose';

export class CreateReplyDTO {
  content: string;
  thread: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}
