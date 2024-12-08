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
  @UseGuards(AuthGuard)  // Ensure the user is authenticated
  async createThread(@Body() createThreadDto: CreateThreadDTO) {
    return this.threadService.createThread(createThreadDto);
  }

  @Get()
  async getThreads() {
    return this.threadService.getThreads();
  }

  @Get(':id')
  async getThreadById(@Param('id') id: string) {
    return this.threadService.getThreadById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)  // Ensure the user is authenticated
  async updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDTO) {
    return this.threadService.updateThread(id, updateThreadDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)  // Ensure the user is authenticated
  async deleteThread(@Param('id') id: string) {
    return this.threadService.deleteThread(id);  // This will also remove the thread from the Forum
  }

  // Search threads based on a keyword (title or content)
  @Get('search')
  async searchThreads(@Query('keyword') keyword: string) {
    return this.threadService.searchThreads(keyword);
  }

  // New method: Find thread by word (searching in the title and content)
  @Get('search-by-word')
  async searchThreadByWord(@Query('word') word: string) {
    return this.threadService.searchThreadByWord(word);
  }
}
