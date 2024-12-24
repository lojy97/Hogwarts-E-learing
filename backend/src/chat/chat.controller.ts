import { Controller, Post, Put, Get, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { ChatRoomService } from './chat.service';
import { CreateChatRoomDTO } from './DTO/create-chat-room.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.schema';

@UseGuards(AuthGuard, RolesGuard)
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
  ) {}

  @Post()
  @Roles(UserRole.Instructor, UserRole.Student, UserRole.Admin)
  async createChatRoom(
    @Body() chatRoomDto: Partial<CreateChatRoomDTO>, 
    @CurrentUser() currentUser: User & { userId: string }
  ) {
    const {title, roomType, participants = [] , course} = chatRoomDto;
    
  
    
    const updatedParticipants = Array.from(new Set([currentUser.userId, ...participants]));
  
    // Fetch user details for validation
    const users = await this.chatRoomService.getUsersByIds(updatedParticipants);
    const userRoles = users.reduce((acc, user) => {
      acc[user.id] = user.role;
      return acc;
    }, {});
  
    switch (currentUser.role) {
      case UserRole.Student:
        // Students can only create chat rooms with other students
        if (Object.values(userRoles).some(role => role !== UserRole.Student)) {
          throw new Error('Students can only create chat rooms with other students.');
        }
        break;
      case UserRole.Instructor:
        // Instructors cannot create chat rooms with admins
        if (Object.values(userRoles).includes(UserRole.Admin)) {
          throw new Error('Instructors cannot create chat rooms with admins.');
        }
        break;
      case UserRole.Admin:
        // Admins can create chat rooms with anyone
        break;
      default:
        throw new Error('Unauthorized');
    }
  
    return this.chatRoomService.createChatRoom(updatedParticipants, roomType, currentUser.userId,title, course);
  }
  


  @Get('all')
  @Roles(UserRole.Instructor, UserRole.Student, UserRole.Admin)
  async viewAllChatRooms() {
    return this.chatRoomService.viewAllChatRooms();
  }

  /**
   * Get a single chat room (Accessible only to participants)
   */
  @Get(':id')
  @Roles(UserRole.Student, UserRole.Instructor, UserRole.Admin)
  async getChatRoom(
    @Param('id') chatRoomId: string,
    @CurrentUser() currentUser: User & { userId: string },
  ) {
    return this.chatRoomService.getChatRoomById(chatRoomId, currentUser.userId);
  }

  /**
   * Update a chat room (Only the creator can update)
   */
  @Put(':id')
  @Roles(UserRole.Student, UserRole.Instructor, UserRole.Admin)
  async updateChatRoom(
    @Param('id') chatRoomId: string,
    @Body() updateData: { title?: string; participants?: string[]; roomType?: string },
    @CurrentUser() currentUser: User & { userId: string },
  ) {
    const { title, participants, roomType } = updateData;
    return this.chatRoomService.updateChatRoom(
      chatRoomId,
      currentUser.userId,
      title, 
      participants,
      roomType,
    );
  }
  

  /**
   * Delete a chat room (Only the creator can delete)
   */
  @Delete(':id')
  @Roles(UserRole.Student, UserRole.Instructor, UserRole.Admin)
  async deleteChatRoom(
    @Param('id') chatRoomId: string,
    @CurrentUser() currentUser: User & { userId: string },
  ) {
    return this.chatRoomService.deleteChatRoom(chatRoomId, currentUser.userId);
  }
}