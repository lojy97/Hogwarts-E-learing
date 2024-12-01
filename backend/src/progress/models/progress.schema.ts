import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Progress {
  @Prop({ required: true })
  progress_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true, min: 0, max: 100  })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);