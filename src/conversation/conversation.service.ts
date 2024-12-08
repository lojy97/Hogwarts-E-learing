import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './models/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>
  ) {}

  async createConversation(chatRoomId: string, participants: string[]): Promise<Conversation> {
    const conversation = new this.conversationModel({
      chatRoomId: new Types.ObjectId(chatRoomId),
      participants: participants.map((id) => new Types.ObjectId(id)),
    });
    return conversation.save();
  }

  async addMessageToConversation(conversationId: string, messageId: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversationId} not found`);
    }

    conversation.messages.push(new Types.ObjectId(messageId));
    return conversation.save();
  }

  async getConversationByChatRoom(chatRoomId: string): Promise<Conversation> {
    return this.conversationModel
      .findOne({ chatRoomId: new Types.ObjectId(chatRoomId) })
      .populate('messages participants')
      .exec();
  }

  async getConversationById(conversationId: string): Promise<Conversation> {
    return this.conversationModel
      .findById(conversationId)
      .populate('messages participants')
      .exec();
  }
}
