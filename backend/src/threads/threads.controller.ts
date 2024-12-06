import { Controller, Get, Post, Body, Param, Put, Delete,Query,UseGuards } from '@nestjs/common';
import { ThreadService } from './threads.service';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@UseGuards(RolesGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  createThread(@Body() createThreadDto: CreateThreadDTO) {
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
  deleteThread(@Param('id') id: string) {
    return this.threadService.deleteThread(id);
  }
  @Get('search')
async searchThreads(@Query('keyword') keyword: string) {
  return this.threadService.searchThreads(keyword);
}
}
