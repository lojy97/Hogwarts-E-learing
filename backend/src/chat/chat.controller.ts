import { Controller, Post, Put, Get, Body, Param,UseGuards } from '@nestjs/common';
import { ChatRoomService } from './chat.service';
import { CreateChatRoomDTO } from './DTO/create-chat-room.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@UseGuards( RolesGuard)
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  async createChatRoom(@Body() chatRoomDto: Partial<CreateChatRoomDTO>) {
    const { participants, roomType } = chatRoomDto;
    return this.chatRoomService.createChatRoom(participants, roomType);
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
