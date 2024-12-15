import * as mongoose from 'mongoose';

export class CreateForumDTO {
  title: string;
  course: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  description?: string;
  moderator: mongoose.Types.ObjectId;
  threads?: mongoose.Types.ObjectId[];
}
