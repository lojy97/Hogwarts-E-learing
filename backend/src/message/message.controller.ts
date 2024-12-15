import { Controller, Post, Body, Request, Delete, Param, UseGuards, Put } from '@nestjs/common';
import { ChatRoomService } from '../chat/chat.service';
import { MessageService } from './message.service';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { ChatRoom } from '../chat/models/chat-room.schema';
import { Message } from './models/message.schema';

@Controller('chat-rooms')
export class MessageController {
  constructor(
    private readonly chatService: ChatRoomService,
    private readonly messageService: MessageService,
  ) {}

  @Post('message')
  @UseGuards(AuthGuard)  // Ensure user is authenticated
  async createMessage(@Body() messageDto: { chatRoomId: string; content: string }, @Request() req) {
    const { chatRoomId, content } = messageDto;
    const userId = req.user.id;  // Get the user ID from the request

    // Check if the user is a participant of the chat room
   
    

    return this.messageService.createMessage(chatRoomId, userId, content);  // Create the message
  }

  @Put('message/:id')
  @UseGuards(AuthGuard)  // Ensure user is authenticated
  async updateMessage(
    @Param('id') messageId: string,
    @Body() updateDto: { content: string; isRead?: boolean },
    @Request() req,
  ) {
    const userId = req.user.id;  // Get the user ID from the request
    const message = await this.messageService.findMessageById(messageId);

    if (message.sender.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    return this.messageService.updateMessage(messageId, updateDto.isRead, updateDto.content);
  }

  @Delete('message/:id')
  @UseGuards(AuthGuard)  // Ensure user is authenticated
  async deleteMessage(@Param('id') messageId: string, @Request() req) {
    const userId = req.user.id;  // Get the user ID from the request
    await this.messageService.deleteMessage(messageId, userId);  // Delete the message
  }
}
