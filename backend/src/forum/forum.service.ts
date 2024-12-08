import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from './models/forum.schema';
import { Thread } from '../threads/models/threads.schema';
import { CreateForumDTO} from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('Forum') private readonly forumModel: Model<Forum>,
    @InjectModel('Thread') private readonly threadModel: Model<Thread>,
  ) {}

  // Create a new forum
  async createForum(createForumDto: CreateForumDTO): Promise<Forum> {
    const forum = new this.forumModel(createForumDto);
    return forum.save();
  }

  // Add a thread to a forum
  async addThreadToForum(forumId: string, threadId: string): Promise<Forum> {
    
    const forum = await this.forumModel.findById(forumId);
    if (!forum) {
      throw new Error(`Forum with ID ${forumId} not found.`);
    }

   
    const thread = await this.threadModel.findById(threadId).populate('creator');
    if (!thread) {
      throw new Error(`Thread with ID ${threadId} not found.`);
    }

  
    if (forum.threads.some((t) => t.threadId.toString() === threadId)) {
      throw new Error(`Thread with ID ${threadId} is already in the forum.`);
    }

    // Add thread details to the forum's threads array
    const threadDetails = {
      threadId: thread._id,
      title: thread.title,
      creator: thread.creator._id, // Assuming `creator` is populated
    };

    return this.forumModel.findByIdAndUpdate(
      forumId,
      { $push: { threads: threadDetails } },
      { new: true },
    );
  }

  async updateForum(id: string, updateForumDto: UpdateForumDTO): Promise<Forum> {
    
    const allowedUpdates = ['name', 'description'];
    const updates = Object.keys(updateForumDto);
    for (const update of updates) {
      if (!allowedUpdates.includes(update)) {
        throw new Error(`Field "${update}" cannot be updated.`);
      }
    }

    const updatedForum = await this.forumModel.findByIdAndUpdate(id, updateForumDto, { new: true });
    if (!updatedForum) {
      throw new Error(`Forum with ID ${id} not found.`);
    }
    return updatedForum;
  }

  // Get all forums
  async getForums(): Promise<Forum[]> {
    return this.forumModel.find().populate('threads.creator').exec();
  }

  // Get a single forum by ID
  async getForumById(id: string): Promise<Forum> {
    const forum = await this.forumModel.findById(id).populate('threads.creator').exec();
    if (!forum) {
      throw new Error(`Forum with ID ${id} not found.`);
    }
    return forum;
  }

  // Delete a forum
  async deleteForum(id: string): Promise<Forum> {
    const deletedForum = await this.forumModel.findByIdAndDelete(id);
    if (!deletedForum) {
      throw new Error(`Forum with ID ${id} not found.`);
    }
    return deletedForum;
  }
}
