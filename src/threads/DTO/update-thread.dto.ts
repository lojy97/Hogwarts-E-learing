import * as mongoose from 'mongoose';

export class UpdateThreadDTO {
  title?: string;
  forum?: mongoose.Types.ObjectId;
  creator?: mongoose.Types.ObjectId;
  updatedAt?: Date;
}
