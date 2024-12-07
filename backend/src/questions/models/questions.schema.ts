import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type questionsDocument = HydratedDocument<questions>
@Schema()
export class questions {
    
@Prop({ type: [String], default: [{question:String,correctAnswer:String}] })
  mcq: {question:string;correctAnswer:string}[];

@Prop({ type: [String], default: [{question:String,correctAnswer:String}] })
  tf: {question:string;correctAnswer:string}[];

}
export const questionsSchema = SchemaFactory.createForClass(questions);
