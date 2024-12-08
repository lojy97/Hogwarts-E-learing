import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './models/chat-room.schema';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(participants: string[], roomType?: string): Promise<ChatRoom> {
    const chatRoom = new this.chatRoomModel({
      participants: participants.map((id) => new Types.ObjectId(id)),
      roomType: roomType || 'Study Group',
    });
    return chatRoom.save();
  }

  async updateChatRoom(chatRoomId: string, participants?: string[], roomType?: string): Promise<ChatRoom> {
    const updateData: Partial<ChatRoom> = {};
    if (participants) {
      updateData.participants = participants.map((id) => new Types.ObjectId(id));
    }
    if (roomType) {
      updateData.roomType = roomType;
    }
    return this.chatRoomModel.findByIdAndUpdate(chatRoomId, updateData, { new: true }).exec();
  }

  async getChatRoomsByParticipant(participantId: string): Promise<ChatRoom[]> {
    return this.chatRoomModel.find({ participants: new Types.ObjectId(participantId) }).exec();
  }
}
