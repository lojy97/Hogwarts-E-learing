import { Injectable, NotFoundException, UnauthorizedException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './models/chat-room.schema';
import { UserRole } from '../user/models/user.schema';

@Injectable()
export class ChatRoomService {
  constructor(@InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>) {}

  async createChatRoom(participants: string[], roomType?: string): Promise<ChatRoom> {
    // Ensure the participants are unique and valid
    const uniqueParticipants = [...new Set(participants.map((id) => new Types.ObjectId(id)))];
    

    return this.createRoomWithParticipants(uniqueParticipants, roomType);
  }


  // Helper function to create the chat room with participants
  private async createRoomWithParticipants(participants: Types.ObjectId[], roomType?: string): Promise<ChatRoom> {
    const chatRoom = new this.chatRoomModel({
      participants: participants,
      roomType: roomType || 'Study Group', // Default room type is 'Study Group'
    });

    return chatRoom.save();
  }
  async deleteChatRoom(chatRoomId: string, userId: string): Promise<void> {
    const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    
    if (chatRoom.creator.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this chat room');
    }

    
    await this.chatRoomModel.findByIdAndDelete(chatRoomId).exec();
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
  async getChatRoomById(chatRoomId: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }
    return chatRoom;
  }

}
