import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {questions} from '../../questions/models/questions.schema'
import {Module} from '../../module/models/module.schema';
export type quizDocument= HydratedDocument<Quiz>
@Schema()

export class Quiz{
    @Prop({required: true , default: 0})
    questionsITF:[number];

    @Prop({required: true, default: 0 })
    questionsIMCQ:[number];   

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
    Module_id: mongoose.Types.ObjectId;

   @Prop({ required: true ,default:Date.now})
   created_at: Date;
  
   @Prop({ type: [{ question: String, correctAnswer: String }], default: [] })
    quizQuestions: {question:string;correctAnswer:string}[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'questions', required: true })
  // quizQuestions: mongoose.Types.ObjectId;


 }
export const quizzesSchema = SchemaFactory.createForClass(Quiz);
