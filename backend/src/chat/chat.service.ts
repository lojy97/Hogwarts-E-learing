import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './models/chat-room.schema';
import{User} from '../user/models/user.schema'
import { UserModule } from 'src/user/user.module';
import { UserSchema } from '../user/models/user.schema';
import { UserService } from 'src/user/user.service';
@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>,
    private readonly UserService: UserService, // Inject UserService
  ) {}

 
  async createChatRoom(participants: string[], roomType: string, creatorId: string,title:String): Promise<ChatRoom> {
    const chatRoom = new this.chatRoomModel({
      title, // Include the title from the DTO
      participants: participants.map((id) => new Types.ObjectId(id)),
      roomType: roomType || 'Study Group',
      creator: new Types.ObjectId(creatorId), // Store the creator's ID
    });
    return chatRoom.save();
  }
  async viewAllChatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomModel
      .find()
      .populate('participants', 'name email')
      .populate('messages')
      .exec();
  }
  


  
 async getChatRoomById(chatRoomId: string, userId: string): Promise<ChatRoom> {
   const chatRoom = await this.chatRoomModel
     .findById(chatRoomId)
     .populate('participants', 'name email')
     .populate('messages')
     .exec();

   if (!chatRoom) {
     throw new NotFoundException(`Chat room with ID ${chatRoomId} not found`);
   }

   const isParticipant = chatRoom.participants.some(
     (participant) => participant._id.toString() === userId,
   );

   if (!isParticipant) {
     throw new UnauthorizedException(
       'You are not authorized to view this chat room',
     );
   }

   return chatRoom;
 }


    async updateChatRoom(
      chatRoomId: string,
      userId: string,
      title?: string,
      participants?: string[],
      roomType?: string,
    ): Promise<ChatRoom> {
      // Find the chat room by ID
      const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
      
     
      if (!chatRoom) {
        throw new NotFoundException(`Chat room with ID ${chatRoomId} not found`);
      }
    
      // Check if the current user is the creator of the chat room
      if (chatRoom.creator.toString() !== userId) {
        throw new UnauthorizedException('You are not authorized to update this chat room');
      }
    
      // Prepare the update data
      const updateData: Partial<ChatRoom> = {};
    
      // Update title if provided
      if (title) updateData.title = title;
    
      // Update participants if provided
      if (participants) {
        updateData.participants = participants.map((id) => new Types.ObjectId(id));
      }
    
      // Update roomType if provided
      if (roomType) updateData.roomType = roomType;
    
      // Perform the update and return the updated chat room
      return this.chatRoomModel
        .findByIdAndUpdate(chatRoomId, updateData, { new: true })
        .populate('participants', 'name email') // Populate participants with name and email
        .exec();
    }
  
    /**
     * Delete a chat room (Only the creator can delete)
    
     */
    async deleteChatRoom(chatRoomId: string, userId: string): Promise<{ message: string }> {
      const chatRoom = await this.chatRoomModel.findById(chatRoomId).exec();
      if (!chatRoom) {
        throw new NotFoundException(`Chat room with ID ${chatRoomId} not found`);
      }
  
      if (chatRoom.creator.toString() !== userId) {
        throw new UnauthorizedException('You are not authorized to delete this chat room');
      }
  
      await this.chatRoomModel.findByIdAndDelete(chatRoomId).exec();
      return { message: `Chat room with ID ${chatRoomId} has been deleted` };
    }
  
    /**
     * Get chat rooms by participant ID
     
     */
    async getChatRoomsByParticipant(participantId: string): Promise<ChatRoom[]> {
      return this.chatRoomModel
        .find({ participants: new Types.ObjectId(participantId) })
        .populate('participants', 'name email')
        .exec();
    }
    async getUsersByIds(userIds: string[]): Promise<User[]> {
      return this.UserService.findUsersByIds(userIds); // Assuming `findUsersByIds` exists in UserService
    }
    
  }
  