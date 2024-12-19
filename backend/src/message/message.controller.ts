import { Controller, Post, Body, Request, Delete, Param, UseGuards, Put, Query, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatRoomService } from '../chat/chat.service';  
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../user/models/user.schema';

@Controller('chatmessage')
export class MessageController {
  constructor(
    private readonly chatService: ChatRoomService,  
    private readonly messageService: MessageService, 
  ) {}

  @Post('message')
  @UseGuards(AuthGuard)  // Ensure user is authenticated
  async createMessage(
    @Body() messageDto: { chatRoomId: string; content: string },
    @CurrentUser() currentUser: User  & { userId: string },  
  ) {
    const { chatRoomId, content } = messageDto;
    const userId = currentUser.userId;  

    // Check if the user is a participant of the chat room using ChatRoomService
    const chatRoom = await this.chatService.getChatRoomById(chatRoomId, userId);  // Use getChatRoomById
    if (!chatRoom) {
      throw new Error('Chat room not found or you are not a participant');
    }

    return this.messageService.createMessage(chatRoomId, userId, content);  // Create the message
  }

  @Put('message/:id')
  @UseGuards(AuthGuard)  
  async updateMessage(
    @Param('id') messageId: string,
    @Body() updateDto: { content: string; isRead?: boolean },
    @CurrentUser() currentUser: User  & { userId: string },  
  ) {
    const userId = currentUser.userId;  
    const message = await this.messageService.findMessageById(messageId);

    if (message.sender.toString() !== userId) {
      throw new Error('Unauthorized');  // Only sender can update the message
    }

    return this.messageService.updateMessage(messageId, updateDto.isRead, updateDto.content);
  }

  @Delete('message/:id')
  @UseGuards(AuthGuard)  
  async deleteMessage(@Param('id') messageId: string, @CurrentUser() currentUser: User &{ userId: string }) {
    const userId = currentUser.userId;  // Get the user ID from CurrentUser decorator
    await this.messageService.deleteMessage(messageId, userId);  // Delete the message
  }

  @Get('search')
  @UseGuards(AuthGuard) 
  async searchMessages(
    @Query('word') word: string,
    @Query('chatRoomId') chatRoomId: string,
    @Request() req,
  ) {
    const userId = req.user.id;  // Get the user ID from the request
    return this.messageService.searchMessagesByWord(word, chatRoomId, userId);
  }
  
}