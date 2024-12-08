import { Injectable, NotFoundException } from '@nestjs/common';
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
    // Create new message
    const message = new this.messageModel({
      chatRoomId: new Types.ObjectId(chatRoomId),
      sender: new Types.ObjectId(sender),
      content,
    });

    // Save the message
    await message.save();

    // Add message to chat room's messages array
    await this.chatRoomModel.findByIdAndUpdate(
      chatRoomId,
      { $push: { messages: message._id } },  // Add message ID to chat room's message list
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
    const message = await this.messageModel.findById(messageId);

    if (!message) {
      throw new NotFoundException(`Message with id ${messageId} not found`);
    }

    if (message.sender.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    // Remove message from the chat room's messages array
    await this.chatRoomModel.findByIdAndUpdate(
      message.chatRoomId,
      { $pull: { messages: messageId } },  // Remove message ID from chat room's message list
      { new: true },
    );

    await this.messageModel.findByIdAndDelete(messageId);
  }
  async findMessageById(messageId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

}
