import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {Course} from '../../course/models/course.schema';
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
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
