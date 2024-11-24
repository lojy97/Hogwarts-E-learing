import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Note extends Document {
  @Prop({ required: true }) 
  note_id: string;
  @Prop({ required: true }) 
  user_id: string;
  @Prop({ required: true }) 
  course_id: string;
  @Prop({ required: true }) 
  content: string;
  @Prop({ required: true }) 
  created_at: Date;
  @Prop({ required: true }) 
  last_updated: Date;
}

export const note = SchemaFactory.createForClass(Note);
