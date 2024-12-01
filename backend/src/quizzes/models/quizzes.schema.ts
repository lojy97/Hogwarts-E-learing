import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Quiz{
  @Prop({ required: true })
  quiz_id: string;

  @Prop({ required: true })
  module_id: string;

  @Prop({ type:[{question:String,correctAnswer:String}],required: true })
  questions: {question:string;correctAnswer:string}[];

  @Prop({ required: true ,default:Date.now})
  created_at: Date;

 
}
export const quizzesSchema = SchemaFactory.createForClass(Quiz);
