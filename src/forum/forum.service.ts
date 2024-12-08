import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from './models/forum.schema';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private forumModel: Model<ForumDocument>,
  ) {}

  async createForum(createForumDto: CreateForumDTO): Promise<Forum> {
    const forum = new this.forumModel(createForumDto);
    return forum.save();
  }

  async updateForum(id: string, updateForumDto: UpdateForumDTO): Promise<Forum> {
    return this.forumModel.findByIdAndUpdate(id, updateForumDto, { new: true });
  }

  async getForums(): Promise<Forum[]> {
    return this.forumModel.find().exec();
  }

  async getForumById(id: string): Promise<Forum> {
    return this.forumModel.findById(id).exec();
  }

  async deleteForum(id: string): Promise<Forum> {
    return this.forumModel.findByIdAndDelete(id);
  }
  async searchForums(keyword: string): Promise<Forum[]> {
    return this.forumModel.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }).exec();
  }

}

