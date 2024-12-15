import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reply, ReplyDocument } from './models/reply.schema';
import { CreateReplyDTO } from './DTO/create-reply.dto';
import { UpdateReplyDTO } from './DTO/update-reply.dto';
import { ThreadService } from 'src/threads/threads.service';
import { Thread, ThreadDocument } from 'src/threads/models/threads.schema';
import { Forum, ForumDocument } from 'src/forum/models/forum.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>,
    @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>,
    @InjectModel(Forum.name) private readonly forumModel: Model<ForumDocument>,
    private readonly userService: UserService,

  ) { }


  async createReply(createReplyDto: CreateReplyDTO, userId: string): Promise<Reply> {
    const session = await this.replyModel.db.startSession();
    session.startTransaction();

    try {
      const reply = new this.replyModel({
        ...createReplyDto,
        author: userId,
      });
      const savedReply = await reply.save({ session });

      // 1. Update the thread to include the reply ID
      const updatedThread = await this.threadModel.findByIdAndUpdate(
        createReplyDto.thread,
        { $push: { replies: savedReply._id } },
        { new: true, session }
      ).populate({
        path: 'forum',
        model: 'Forum'
      });

      if (!updatedThread) {
        throw new Error('Thread not found');
      }

      // 2. Get the forum ID from the updated thread
      const forumId = updatedThread.forum;

      // 3. Find the forum using the correct ID
      const forum = await this.forumModel.findById(forumId).session(session);
      if (!forum) {
        console.error(`Parent forum not found for forum ID: ${forumId}`);
        throw new Error('Parent forum not found');
      }
      const updatedTitle = updatedThread.title;
      // 4. Update the forum - Add the reply to the thread within the forum
      await this.forumModel.updateOne(
        {
          _id: forumId,
          'threads.threadId': updatedThread._id
        },
        {
          $set: { 'threads.$.title': updatedTitle },
          $push: {
            'threads.$.replies': {
              replyId: savedReply._id,
              content: savedReply.content,
              author: savedReply.author
            }
          }
        },
        { session }
      );

      await session.commitTransaction();
      return savedReply;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating reply:', error);
      throw error; // Re-throw to handle it further up
    } finally {
      session.endSession();
    }
  }


  async updateReply(id: string, updateReplyDto: UpdateReplyDTO): Promise<Reply> {

    const updatedReply = await this.replyModel.findByIdAndUpdate(id, updateReplyDto, { new: true });
    if (!updatedReply) {
      throw new Error('Reply not found');
    }

    const replyDetails = {
      replyId: updatedReply._id,
      content: updatedReply.content,
      author: updatedReply.author,
    };


    const thread = await this.threadModel.findOne({ 'replies.replyId': id });
    if (!thread) {
      throw new Error('Thread not found or reply does not exist in thread');
    }

    await this.threadModel.updateOne(
      { _id: thread._id, 'replies.replyId': id },
      { $set: { 'replies.$': replyDetails } }
    );


    const forum = await this.forumModel.findOne({ 'threads.replies.replyId': id });
    if (!forum) {
      throw new Error('Forum not found or reply does not exist in forum thread');
    }

    await this.forumModel.updateOne(
      { _id: forum._id, 'threads.threadId': thread._id, 'threads.replies.replyId': id },
      {
        $set: {
          'threads.$[thread].replies.$[reply]': replyDetails,
        },
      },
      {
        arrayFilters: [
          { 'thread.threadId': thread._id },
          { 'reply.replyId': id },
        ],
      }
    );

    return updatedReply;
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

    const reply = await this.replyModel.findByIdAndDelete(id);
    if (!reply) {
      throw new Error('Reply not found');
    }


    const threadId = reply.thread;
    const updatedThread = await this.threadModel.findByIdAndUpdate(
      threadId,
      { $pull: { replies: { replyId: id } } },
      { new: true }
    );

    if (!updatedThread) {
      throw new Error('Thread not found');
    }


    const updatedForum = await this.forumModel.findOneAndUpdate(
      { 'threads.threadId': threadId },
      { $pull: { 'threads.$.replies': { replyId: id } } },
      { new: true }
    );

    if (!updatedForum) {
      throw new Error('Parent forum not found');
    }

    return { message: 'Reply deleted successfully' };
  }



  async searchReplies(keyword: string): Promise<Reply[]> {
    return this.replyModel.find({
      content: { $regex: keyword, $options: 'i' }
    }).exec();
  }
}