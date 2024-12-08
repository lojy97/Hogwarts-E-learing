import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type questionsDocument = HydratedDocument<questions>
@Schema()
export class questions {

  @Prop({ type: [{ id:mongoose.Types.ObjectId,question: String, correctAnswer: String }], default: [] })
  tf:{id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];
  
  @Prop({ type: [{ id:mongoose.Types.ObjectId,question: String, correctAnswer: String }], default: [] })
  mcq:{id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];
}
export const questionsSchema = SchemaFactory.createForClass(questions);
