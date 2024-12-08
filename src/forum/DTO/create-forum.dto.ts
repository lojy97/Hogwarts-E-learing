import * as mongoose from 'mongoose';

export class CreateForumDTO {
  title: string;
  course: mongoose.Types.ObjectId; 
  module?: mongoose.Types.ObjectId; // Optional for module-specific forums
  moderator: mongoose.Types.ObjectId;
}
