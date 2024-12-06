import { Controller, Get, Post, Body, Param, Put, Delete,Query ,UseGuards} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDTO } from './DTO/create-reply.dto';
import { UpdateReplyDTO } from './DTO/update-reply.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@UseGuards(AuthGuard)
@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  createReply(@Body() createReplyDto: CreateReplyDTO) {
    return this.replyService.createReply(createReplyDto);
  }

  @Get()
  getReplies() {
    return this.replyService.getReplies();
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
  deleteReply(@Param('id') id: string) {
    return this.replyService.deleteReply(id);
  }
  @Get('search')
async searchReplies(@Query('keyword') keyword: string) {
  return this.replyService.searchReplies(keyword);
}

}
