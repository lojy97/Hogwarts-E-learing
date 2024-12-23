import { Injectable, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Forum } from './models/forum.schema';
import { Thread } from '../threads/models/threads.schema';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { UserService } from '../user/user.service';  // Inject UserService to check enrollment

@Injectable()
export class ForumService {
  constructor(
    @InjectModel('Forum') private readonly forumModel: Model<Forum>,
    @InjectModel('Thread') private readonly threadModel: Model<Thread>,
    private readonly userService: UserService,  // Inject UserService
  ) {}

  // Create a new forum, ensuring the user is enrolled in the course
  async createForum(createForumDto: CreateForumDTO, userId: string): Promise<Forum> {
    // Ensure courseId is an ObjectId
    const courseId = new Types.ObjectId(createForumDto.course);  // Convert to ObjectId

    // Check if the user is enrolled in the course
    const isEnrolled = await this.userService.hasCourse(userId, courseId.toString());
    if (!isEnrolled) {
      throw new UnauthorizedException('You must be enrolled in this course to create a forum.');
    }

    // Proceed to create the forum
    const forum = new this.forumModel({
      ...createForumDto,
      moderator: userId, // Set the creator of the forum
    });
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

  // Update a forum, but only if the user is the creator
  async updateForum(id: string, updateForumDto: UpdateForumDTO, userId: string): Promise<Forum> {
    const forum = await this.forumModel.findById(id).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${id} not found.`);
    }

    // Check if the user is the moderator
    if (forum.moderator.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to update this forum.');
    }

    // Proceed with updating the forum
    return this.forumModel.findByIdAndUpdate(id, updateForumDto, { new: true }).exec();
  }

  // Delete a forum (only the moderator can delete)
  async deleteForum(id: string, userId: string, role: string): Promise<Forum> {
    const forum = await this.forumModel.findById(id).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${id} not found.`);
    }
  
    // Check if the user is the moderator, an instructor, or an admin
    if (forum.moderator.toString() !== userId && role !== 'instructor' && role !== 'admin') {
      throw new UnauthorizedException('You are not authorized to delete this forum.');
    }
  
    // Proceed with deleting the forum
    return this.forumModel.findByIdAndDelete(id).exec();
  }

  // Get all forums
  async getForums(): Promise<Forum[]> {
    return this.forumModel.find().populate('threads.creator').exec();
  }

  // Get a specific forum by ID
  async getForumById(id: string, ): Promise<Forum> {
    const forum = await this.forumModel.findById(id).populate('threads.creator').exec();
    if (!forum) {
      throw new Error(`Forum with ID ${id} not found.`);
    }
    return forum;
  }

  // Delete a forum, but only if the user is the creator
  
}
