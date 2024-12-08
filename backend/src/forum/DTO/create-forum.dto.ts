import * as mongoose from 'mongoose';

export class CreateForumDTO {
  title: string;
  course: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  moderator: mongoose.Types.ObjectId;
  threads?: mongoose.Types.ObjectId[];
}
