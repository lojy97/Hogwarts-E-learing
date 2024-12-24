import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply, ReplyDocument } from './models/reply.schema';
import { CreateReplyDTO } from './DTO/create-reply.dto';
import { UpdateReplyDTO } from './DTO/update-reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
  ) {}

  async createReply(createReplyDto: CreateReplyDTO): Promise<Reply> {
    const reply = new this.replyModel(createReplyDto);
    return reply.save();
  }

  async updateReply(id: string, updateReplyDto: UpdateReplyDTO): Promise<Reply> {
    return this.replyModel.findByIdAndUpdate(id, updateReplyDto, { new: true });
  }

  async getReplies(): Promise<Reply[]> {
    return this.replyModel.find().exec();
  }

  async getReplyById(id: string): Promise<Reply> {
    return this.replyModel.findById(id).exec();
  }

  async deleteReply(id: string): Promise<Reply> {
    return this.replyModel.findByIdAndDelete(id);
  }
  async searchReplies(keyword: string): Promise<Reply[]> {
    return this.replyModel.find({
      content: { $regex: keyword, $options: 'i' }
    }).exec();
  }



}
