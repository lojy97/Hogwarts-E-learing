import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './models/message.schema';
import { ChatRoom } from '../chat/models/chat-room.schema';  // Import ChatRoom schema

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

 
  
 
  async createMessage(chatRoomId: string, sender: string, content: string): Promise<Message> {
    // Check if the user is a participant of the chat room
    const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
    if (!chatRoom) {
      throw new UnauthorizedException('Chat room not found');
    }
  
   
    const senderObjectId = new Types.ObjectId(sender);
  
    // Check if sender is in the participants list 
    if (!chatRoom.participants.some(participant => participant.toString() === senderObjectId.toString())) {
      throw new UnauthorizedException('You are not a participant of this chat room');
    }
  
    // Create new message
    const message = new this.messageModel({
      chatRoomId: new Types.ObjectId(chatRoomId),
      sender: senderObjectId,  
      content,
    });
  
    // Save the message
    await message.save();
  
    // Add message to chat room's messages array
    await this.chatRoomModel.findByIdAndUpdate(
      chatRoomId,
      { $push: { messages: message._id } },  
      { new: true },
    );
  
    return message;
  }
  

  async updateMessage(messageId: string, isRead?: boolean, content?: string): Promise<Message> {
    const updateData: Partial<Message> = {};
    if (isRead !== undefined) {
      updateData.isRead = isRead;
    }
    if (content) {
      updateData.content = content;
    }

    return this.messageModel.findByIdAndUpdate(messageId, updateData, { new: true }).exec();
  }

  async getMessagesByChatRoom(chatRoomId: string): Promise<Message[]> {
    return this.messageModel.find({ chatRoomId: new Types.ObjectId(chatRoomId) }).exec();
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this message');
    }

    await this.messageModel.findByIdAndDelete(messageId).exec();
  }

  async findMessageById(messageId: string): Promise<Message> {
    return this.messageModel.findById(messageId).exec();
  }

  //  search messages by content
  async searchMessagesByWord(word: string, chatRoomId: string, userId: string): Promise<Message[]> {
    // Check if the user is a participant of the chat room
    const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
    if (!chatRoom || !chatRoom.participants.some(participant => participant.toString() === userId)) {
      throw new UnauthorizedException('You are not a participant of this chat room');
    }
    
  
    return this.messageModel
      .find({ chatRoomId: new Types.ObjectId(chatRoomId), content: { $regex: word, $options: 'i' } })
      .exec();
  }
 
}
