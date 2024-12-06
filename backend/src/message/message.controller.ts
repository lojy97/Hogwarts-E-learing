import { Controller, Post, Put, Get, Body, Param ,UseGuards,Delete,Request} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from './DTO/message.dto';
import { User } from '../user/models/user.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@UseGuards( RolesGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() messageDto: Partial<MessageDto>) {
    const { chatRoomId, sender, content } = messageDto;
    return this.messageService.createMessage(chatRoomId, sender, content);
  }

  @Put(':id')
  async updateMessage(@Param('id') messageId: string, @Body() messageDto: Partial<MessageDto>) {
    const { isRead, content } = messageDto;
    return this.messageService.updateMessage(messageId, isRead, content);
  }

  @Get(':chatRoomId')
  async getMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.messageService.getMessagesByChatRoom(chatRoomId);
  }
  @UseGuards( RolesGuard)
  @Delete(':id')
  async deleteMessage(@Param('id') messageId: string, @Request() req) {
    const user = req.user; // Access the user from the request object

    if (!user) {
      throw new Error('User not authenticated');
    }

    await this.messageService.deleteMessage(messageId, user.id); // Pass user.id to service
    return { message: 'Message deleted successfully' };
  }

}
