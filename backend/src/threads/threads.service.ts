import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Thread, ThreadDocument } from './models/threads.schema';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { Reply, ReplyDocument } from '../reply/models/reply.schema';
import { CreateReplyDTO } from '../reply/DTO/create-reply.dto';
import { Forum, ForumDocument } from '../forum/models/forum.schema';
import { ForumService } from '../forum/forum.service';
import { Inject } from '@nestjs/common';
import { Module, forwardRef } from '@nestjs/common';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    @InjectModel(Forum.name) private readonly forumModel: Model<Forum>,
   // Inject ForumService here
  ) {}

  // Create a thread and update the forum with the new thread

  async createThread(createThreadDto: CreateThreadDTO): Promise<Thread> {
    const thread = new this.threadModel(createThreadDto);

    
    const savedThread = await thread.save();

    
    await this.forumModel.findByIdAndUpdate(
      createThreadDto.forum, 
      { $push: { threads: savedThread._id } },
    );

    return savedThread;
  }
  
 
  async addReplyToThread(threadId: string, replyId: string): Promise<Thread> {
    return this.threadModel.findByIdAndUpdate(
      threadId,
      { $push: { replies: replyId } },
      { new: true }
    );
  }
  

  async updateThread(id: string, updateThreadDto: UpdateThreadDTO): Promise<Thread> {
    const thread = await this.threadModel.findByIdAndUpdate(id, updateThreadDto, {
      new: true,
    });
    if (!thread) {
      throw new Error('Thread not found');
    }
  
    
    await this.forumModel.findByIdAndUpdate(thread.forum, {
      $set: { threads: thread._id },  
    });
  
    return thread;
  }

  async getThreads(): Promise<Thread[]> {
    return this.threadModel.find().exec();
  }

  async getThreadById(id: string): Promise<Thread> {
    return this.threadModel.findById(id).exec();
  }
  async deleteThread(id: string): Promise<any> {
    // Find the thread to delete
    const thread = await this.threadModel.findById(id);
    if (!thread) {
      throw new Error('Thread not found');
    }

    await this.forumModel.findByIdAndUpdate(
      thread.forum,
      { $pull: { threads: thread._id } },  
      { new: true }
    );

    
    return await this.threadModel.findByIdAndDelete(id);
  }

  async searchThreads(keyword: string): Promise<Thread[]> {
    return this.threadModel.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ],
    }).exec();
  }

  
  
  
}
