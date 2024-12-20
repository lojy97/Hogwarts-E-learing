import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export type NotificationsDocument= HydratedDocument<Notifications>
@Schema()
export class Notifications {


  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

 
  
}

export const NotificationssSchema = SchemaFactory.createForClass(Notifications);