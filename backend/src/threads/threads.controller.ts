import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ThreadService } from './threads.service';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { CreateReplyDTO } from '../reply/DTO/create-reply.dto'; // Import for replies
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}


  @Post()
  async createThread(@Body() createThreadDto: CreateThreadDTO) {
    return this.threadService.createThread(createThreadDto);
  }

  @Get()
  getThreads() {
    return this.threadService.getThreads();
  }

  @Get(':id')
  getThreadById(@Param('id') id: string) {
    return this.threadService.getThreadById(id);
  }

  @Put(':id')
  updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDTO) {
    return this.threadService.updateThread(id, updateThreadDto);
  }

  @Delete(':id')
  async deleteThread(@Param('id') id: string) {
    return this.threadService.deleteThread(id);  // This will also remove the thread from the Forum
  }
  

  

 

  @Get('search')
  async searchThreads(@Query('keyword') keyword: string) {
    return this.threadService.searchThreads(keyword);
  }
}

