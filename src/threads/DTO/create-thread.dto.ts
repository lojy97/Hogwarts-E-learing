import * as mongoose from 'mongoose';

export class CreateThreadDTO {
  title: string;
  forum: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
}
