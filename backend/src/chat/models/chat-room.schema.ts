import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Message } from 'src/message/models/message.schema';
export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({ type: String, required: true })
  title: String;


  @Prop({ type: [Types.ObjectId], required: true, ref: 'User' })
  participants: Types.ObjectId[]; // Array of User IDs

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ default: 'Study Group' })
  roomType: string; // e.g., 'Study Group' or 'One-on-One

  @Prop({ type: Types.ObjectId, ref: 'User' })  // Store creator's ID
  creator: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })  // Array of messages
  messages: Message[];
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
