import * as mongoose from 'mongoose';

export class UpdateReplyDTO {
  content?: string;
  thread?: mongoose.Types.ObjectId;
  author?: mongoose.Types.ObjectId;
}
