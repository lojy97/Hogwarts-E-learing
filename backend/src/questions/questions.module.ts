import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Schema()
export class questions {

@Prop({ type: [String], default: [{question:String,correctAnswer:String}] })
  mcq: {question:string;correctAnswer:string}[];

@Prop({ type: [String], default: [{question:String,correctAnswer:String}] })
  tf: {question:string;correctAnswer:string}[];

}
/*
@Prop({ type:[{question:String,correctAnswer:String}],required: true })
questions: {question:string;correctAnswer:string}[];
export const questionsSchema = SchemaFactory.createForClass(questions);
*/