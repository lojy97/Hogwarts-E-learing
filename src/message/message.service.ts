import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './models/message.schema';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async createMessage(chatRoomId: string, sender: string, content: string): Promise<Message> {
    const message = new this.messageModel({
      chatRoomId: new Types.ObjectId(chatRoomId),
      sender: new Types.ObjectId(sender),
      content,
    });
    return message.save();
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

    // Check if the user is authorized to delete the message
    if (message.sender.toString() !== userId) {
      throw new Error('Unauthorized'); // You could throw a custom error here
    }

    await this.messageModel.findByIdAndDelete(messageId);
  }
}

