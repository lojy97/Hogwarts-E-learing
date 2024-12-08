import { Controller, Post, Put, Get, Body, Param, UseGuards, Request,Delete } from '@nestjs/common';
import { ChatRoomService } from './chat.service';
import { CreateChatRoomDTO } from './DTO/create-chat-room.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

@UseGuards(AuthGuard, RolesGuard) 
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  @Roles(UserRole.Instructor, UserRole.Student) // Allow both instructors and students to create chat rooms
  async createChatRoom(@Body() chatRoomDto: Partial<CreateChatRoomDTO>, @Request() req) {
    const { participants, roomType } = chatRoomDto;
    const userRole = req.user.role;  // Assuming the user role is available in req.user
  
    //  only instructors can create chat rooms with students
    if (userRole === UserRole.Instructor) {
      // Instructor can create a group chat with students
      return this.chatRoomService.createChatRoom(participants, roomType);
    } else if (userRole === UserRole.Student) {
      // Student can only create a group chat with other students
      const validParticipants = participants.filter((participant) => participant !== req.user.id); // Ensure user is not a participant
      return this.chatRoomService.createChatRoom(validParticipants, roomType);
    } else {
      throw new Error('Unauthorized'); 
    }
  }
  

  @Put(':id')
  async updateChatRoom(@Param('id') chatRoomId: string, @Body() chatRoomDto: Partial<CreateChatRoomDTO>) {
    const { participants, roomType } = chatRoomDto;
    return this.chatRoomService.updateChatRoom(chatRoomId, participants, roomType);
  }

  @Get(':participantId')
  async getChatRooms(@Param('participantId') participantId: string) {
    return this.chatRoomService.getChatRoomsByParticipant(participantId);
  }

}
