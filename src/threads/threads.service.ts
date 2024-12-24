import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from '../threads/models/threads.schema';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  async createThread(createThreadDto: CreateThreadDTO): Promise<Thread> {
    const thread = new this.threadModel(createThreadDto);
    return thread.save();
  }

  async updateThread(id: string, updateThreadDto: UpdateThreadDTO): Promise<Thread> {
    return this.threadModel.findByIdAndUpdate(id, updateThreadDto, { new: true });
  }

  async getThreads(): Promise<Thread[]> {
    return this.threadModel.find().exec();
  }

  async getThreadById(id: string): Promise<Thread> {
    return this.threadModel.findById(id).exec();
  }

  async deleteThread(id: string): Promise<Thread> {
    return this.threadModel.findByIdAndDelete(id);
  }
  async searchThreads(keyword: string): Promise<Thread[]> {
    return this.threadModel.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    }).exec();
  }
  
}
