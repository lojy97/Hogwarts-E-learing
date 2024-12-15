import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Thread, ThreadDocument } from './models/threads.schema';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { Reply, ReplyDocument } from '../reply/models/reply.schema';
import { CreateReplyDTO } from '../reply/DTO/create-reply.dto';
import { Forum, ForumDocument } from '../forum/models/forum.schema';
import { ForumService } from '../forum/forum.service';
import { Inject } from '@nestjs/common';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<Thread>,
    @InjectModel(Forum.name) private readonly forumModel: Model<Forum>,
    private readonly userService: UserService,

  ) { }



  async createThread(createThreadDto: CreateThreadDTO, userId: string): Promise<Thread> {
    // Check if the user is enrolled in the course linked to the forum
    const forum = await this.forumModel.findById(createThreadDto.forum).exec();
    if (!forum) {
      throw new Error('Forum not found');
    }

    const isEnrolled = await this.userService.hasCourse(userId, forum.course.toString());
    if (!isEnrolled) {
      throw new Error('You must be enrolled in the course to post a thread in this forum.');
    }

    // If the user is enrolled, proceed to create the thread
    const thread = new this.threadModel({
      ...createThreadDto,
      creator: userId, // Set the creator of the forum
    });
    const savedThread = await thread.save();

    await this.forumModel.findByIdAndUpdate(
      createThreadDto.forum,
      { $push: { threads: savedThread._id } },
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



  async updateThread(id: string, updateThreadDto: UpdateThreadDTO, userId: string): Promise<Thread> {
    // Find the thread by its ID
    const updatedThread = await this.threadModel.findById(id).populate('creator');

    if (!updatedThread) {
      throw new Error('Thread not found');
    }

    // Check if the user is the creator of the thread
    if (updatedThread.creator._id.toString() !== userId) {
      throw new Error('You are not authorized to update this thread.');
    }

    // Proceed to update the thread with the provided data
    const updated = await this.threadModel.findByIdAndUpdate(
      id,
      updateThreadDto,
      { new: true }, // Return the updated thread
    ).populate('creator');

    // Update the thread details in the forum model
    const threadDetails = {
      threadId: updated._id,
      title: updated.title,
      creator: updated.creator?._id,
      replies: updated.replies,
    };

    await this.forumModel.updateOne(
      { 'threads.threadId': updated._id },
      {
        $set: {
          'threads.$.title': updated.title,
          'threads.$.creator': updated.creator?._id,
          'threads.$.replies': updated.replies, // Preserve replies
        },
      },
    );

    return updated;
  }




  async getThreads(): Promise<Thread[]> {
    return this.threadModel.find().exec();
  }

  async getThreadById(id: string): Promise<Thread> {
    return this.threadModel.findById(id).exec();
  }
  async deleteThread(id: string, userId: string): Promise<any> {
    // Find the thread to delete
    const thread = await this.threadModel.findById(id).populate('creator');
    if (!thread) {
      throw new Error('Thread not found');
    }

    // Check if the user is the creator of the thread
    if (thread.creator._id.toString() !== userId) {
      throw new Error('You are not authorized to delete this thread.');
    }

    // Remove the thread reference from the forum
    await this.forumModel.findByIdAndUpdate(
      thread.forum,
      { $pull: { threads: thread._id } },
      { new: true }
    );

    // Delete the thread
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