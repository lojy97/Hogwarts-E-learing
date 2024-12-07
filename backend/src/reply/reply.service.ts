import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Reply, ReplyDocument } from './models/reply.schema';
import { CreateReplyDTO } from './DTO/create-reply.dto';
import { UpdateReplyDTO } from './DTO/update-reply.dto';
import { ThreadService } from 'src/threads/threads.service';
import { Thread, ThreadDocument } from 'src/threads/models/threads.schema';
@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>
  ) {}

  
  async createReply(createReplyDto: CreateReplyDTO): Promise<Reply> {
    const reply = new this.replyModel(createReplyDto);

    
    const savedReply = await reply.save();

    // Update the thread's replies array
    await this.threadModel.findByIdAndUpdate(
      createReplyDto.thread, // Assuming `thread` is passed in the DTO
      { $push: { replies: savedReply._id } },
    );

    return savedReply;
  }
  
  
  
  async updateReply(id: string, updateReplyDto: UpdateReplyDTO): Promise<Reply> {
    const reply = await this.replyModel.findByIdAndUpdate(id, updateReplyDto, {
      new: true,
    });
    if (!reply) {
      throw new Error('Reply not found');
    }
  
    
    return reply;
  }

  async getReplies(): Promise<Reply[]> {
    return this.replyModel.find().exec();
  }

  async getRepliesByThread(threadId: string): Promise<Reply[]> {
    return this.replyModel.find({ thread: threadId }).exec();
  }

  async getReplyById(id: string): Promise<Reply> {
    return this.replyModel.findById(id).exec();
  }

  async deleteReply(id: string): Promise<any> {
    
    const reply = await this.replyModel.findById(id);
    if (!reply) {
      throw new Error('Reply not found');
    }

    
    await this.threadModel.findByIdAndUpdate(
      reply.thread,
      { $pull: { replies: reply._id } },  
      { new: true }
    );

    
    return await this.replyModel.findByIdAndDelete(id);
  }

  async searchReplies(keyword: string): Promise<Reply[]> {
    return this.replyModel.find({
      content: { $regex: keyword, $options: 'i' }
    }).exec();
  }
  
}
