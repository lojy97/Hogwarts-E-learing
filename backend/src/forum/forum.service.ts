import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Forum, ForumDocument } from './models/forum.schema';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { Thread, ThreadDocument } from '../threads/models/threads.schema';
import { CreateThreadDTO } from '../threads/DTO/create-thread.dto';
import { ThreadService } from '../threads/threads.service';
@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<ForumDocument>,

    
  ) {}

  async createForum(createForumDto: CreateForumDTO): Promise<Forum> {
    const forum = new this.forumModel(createForumDto);
    return forum.save();
  }
  async addThreadToForum(forumId: string, threadId: string): Promise<Forum> {
    return this.forumModel.findByIdAndUpdate(
      forumId,
      { $push: { threads: threadId } },
      { new: true }
    );
  }
  
 

  async updateForum(id: string, updateForumDto: UpdateForumDTO): Promise<Forum> {
    return this.forumModel.findByIdAndUpdate(id, updateForumDto, { new: true });
  }

  async getForums(): Promise<Forum[]> {
    const forums = await this.forumModel.find().exec();
    console.log('Fetched Forums:', forums); // Debug log
    return forums;
  }
  
  async getForumById(id: string): Promise<Forum> {
    const forum = await this.forumModel.findById(id).exec();
    console.log('Fetched Forum by ID:', forum); // Debug log
    return forum;
  }
  

  async deleteForum(id: string): Promise<Forum> {
    return this.forumModel.findByIdAndDelete(id);
  }



  
}
