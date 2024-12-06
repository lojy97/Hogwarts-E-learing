import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {Quiz} from '../../quizzes/models/quizzes.schema';
@Schema()
export class Response {
 

  @Prop({ required: true })
  user_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quizzes', required: true })
  quiz_id: mongoose.Types.ObjectId;

  @Prop({ type: [{ questionId: String, answer: String }], required: true })
  answers: { questionId: string; answer: string }[];
  @Prop({ required: true })
  score: number;

  @Prop({ required: true, default: Date.now })
  submittedAt: Date;
}
export const ResponseSchema = SchemaFactory.createForClass(Response);