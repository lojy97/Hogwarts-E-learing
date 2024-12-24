import * as mongoose from 'mongoose';

export class UpdateForumDTO {
  title?: string;
  course?: mongoose.Types.ObjectId;
  module?: mongoose.Types.ObjectId;
  moderator?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}
