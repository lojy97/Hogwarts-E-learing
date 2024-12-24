import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto, AddMessageToConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    const { chatRoomId, participants } = createConversationDto;
    return this.conversationService.createConversation(chatRoomId, participants);
  }

  @Post(':id/messages')
  async addMessageToConversation(
    @Param('id') conversationId: string,
    @Body() { messageId }: AddMessageToConversationDto
  ) {
    return this.conversationService.addMessageToConversation(conversationId, messageId);
  }

  @Get(':chatRoomId')
  async getConversationByChatRoom(@Param('chatRoomId') chatRoomId: string) {
    return this.conversationService.getConversationByChatRoom(chatRoomId);
  }

  @Get('by-id/:id')
  async getConversationById(@Param('id') conversationId: string) {
    return this.conversationService.getConversationById(conversationId);
  }
}
