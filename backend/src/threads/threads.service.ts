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
  
  ) {}

 

  async createThread(createThreadDto: CreateThreadDTO): Promise<Thread> {
    const thread = new this.threadModel(createThreadDto);
    const savedThread = await thread.save();
  
    
    const threadDetails = {
      threadId: savedThread._id,
      title: savedThread.title,
      creator: savedThread.creator, 
    };
  
    await this.forumModel.findByIdAndUpdate(
      createThreadDto.forum,
      { $push: { threads: threadDetails } },
      { new: true },
    );
  
    return savedThread;
  }
  
  
 
  async addReplyToThread(
    threadId: string,
    replyDetails: { replyId: string; content: string; author: string },
  ): Promise<Thread> {
  
    const updatedThread = await this.threadModel.findByIdAndUpdate(
      threadId,
      { $push: { replies: replyDetails } },
      { new: true },
    ).populate('replies.author');
  
    if (!updatedThread) {
      throw new Error('Thread not found');
    }
  
   
    const forum = await this.forumModel.findOne({ 'threads.threadId': threadId });
  
    if (!forum) {
      throw new Error('Parent forum not found');
    }
  
    
    await this.forumModel.updateOne(
      {
        _id: forum._id,
        'threads.threadId': threadId,
      },
      {
        $push: {
          'threads.$.replies': replyDetails,
        },
      },
    );
  
    return updatedThread;
  }
  
  
  

  async updateThread(id: string, updateThreadDto: UpdateThreadDTO): Promise<Thread> {
   
    const updatedThread = await this.threadModel.findByIdAndUpdate(
      id,
      updateThreadDto,
      { new: true }, 
    ).populate('creator'); 
  
    if (!updatedThread) {
      throw new Error('Thread not found');
    }
  
    
    const threadDetails = {
      threadId: updatedThread._id,
      title: updatedThread.title,
      creator: updatedThread.creator?._id,
      replies: updatedThread.replies, 
    };
  
    await this.forumModel.updateOne(
      { 'threads.threadId': updatedThread._id }, 
      {
        $set: {
          'threads.$.title': updatedThread.title, 
          'threads.$.creator': updatedThread.creator?._id,
          'threads.$.replies': updatedThread.replies, // Preserve replies
        },
      },
    );
  
    return updatedThread;
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
  async searchThreadByWord(word: string): Promise<Thread[]> {
    return this.threadModel.find({
      $or: [
        { title: { $regex: word, $options: 'i' } }, 
        { content: { $regex: word, $options: 'i' } }, 
      ],
    }).exec();
}
}