import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type questionsDocument = HydratedDocument<questions>
@Schema()
export class questions {

  @Prop({ type: [{ question: String, correctAnswer: String }], default: [] })
  tf: { question: string; correctAnswer: string }[];

  @Prop({ type: [{ question: String, correctAnswer: String }], default: [] })
  mcq: { question: string; correctAnswer: string }[];

}
export const questionsSchema = SchemaFactory.createForClass(questions);
