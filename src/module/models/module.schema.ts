import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {Course} from '../../course/models/course.schema';
export type ModuleDocument = HydratedDocument<Module>;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  moduleId: string;

  @Prop({ required: true })
  courseId: string; // Associated course ID

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  resources: string[]; // Array of URLs to additional resources (optional)

  @Prop({ default: Date.now })
  createdAt: Date; // Automatically generated timestamp
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
