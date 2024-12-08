import * as mongoose from 'mongoose';

export class UpdateThreadDTO {
  title?: string;
  forum?: mongoose.Types.ObjectId;
  creator?: mongoose.Types.ObjectId;
  
  replies?: Array<{ replyId: string; content: string }>; // Array of reply updates
  
  
}
