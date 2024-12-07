import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {Course} from '../../course/models/course.schema';
import {questions} from '../../questions/models/questions.schema'
export type ModuleDocument = HydratedDocument<Module>;
import * as mongoose from 'mongoose';
@Schema({ timestamps: true })
export class Module {

  @Prop({ type: mongoose.Types.ObjectId, ref: Course.name, required: true })
  courseId: mongoose.Types.ObjectId; 
  @Prop({ required: true,unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  resources: string[]; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: String,
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  })
  difficulty: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'questions', required: true })
  questionBank_id: mongoose.Types.ObjectId;
}



export const ModuleSchema = SchemaFactory.createForClass(Module);
