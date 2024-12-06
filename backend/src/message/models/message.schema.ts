import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import {ChatRoom} from '../../chat/models/chat-room.schema'
export type MessageDocument = HydratedDocument<Message>;
@Schema({ timestamps: true })
export class Message {
@Prop({ type: Types.ObjectId, required: true, ref: 'ChatRoom' })
chatRoomId: Types.ObjectId; 

@Prop({ type: Types.ObjectId, required: true, ref: 'User' })
sender: Types.ObjectId; // User ID

@Prop({ required: true })
content: string;

@Prop({ default: false })
isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
