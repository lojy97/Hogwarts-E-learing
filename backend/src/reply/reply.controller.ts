import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDTO } from './DTO/create-reply.dto';
import { UpdateReplyDTO } from './DTO/update-reply.dto';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.schema';
import { UnauthorizedException } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  async createReply(@Body() createReplyDto: CreateReplyDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }
    return this.replyService.createReply(createReplyDto, user.userId.toString());
  }

  @Get(':threadId')
  getReplies(@Param('threadId') threadId: string) {
    return this.replyService.getRepliesByThread(threadId);
  }

  @Get(':id')
  getReplyById(@Param('id') id: string) {
    return this.replyService.getReplyById(id);
  }

  @Put(':id')
  updateReply(@Param('id') id: string, @Body() updateReplyDto: UpdateReplyDTO) {
    return this.replyService.updateReply(id, updateReplyDto);
  }

  @Delete(':id')
  async deleteReply(@Param('id') id: string) {
    return this.replyService.deleteReply(id);  // This will also remove the reply from the Thread
  }
  

  @Get('search')
  async searchReplies(@Query('keyword') keyword: string) {
    return this.replyService.searchReplies(keyword);
  }
}
