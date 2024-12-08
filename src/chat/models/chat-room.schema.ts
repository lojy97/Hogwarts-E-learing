import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true })
export class ChatRoom {


    @Prop({ type: [Types.ObjectId], required: true, ref: 'User' })
    participants: Types.ObjectId[]; // Array of User IDs
  
    @Prop({ default: 'Study Group' })
    roomType: string; // e.g., 'Study Group' or 'One-on-One'
  }
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
