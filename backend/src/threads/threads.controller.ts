import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards,UnauthorizedException,Req,HttpException, HttpStatus } from '@nestjs/common';
import { ThreadService } from './threads.service';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { CreateReplyDTO } from '../reply/DTO/create-reply.dto'; // Import for replies
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../user/models/user.schema';



@UseGuards(AuthGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  async createThread(@Body() createThreadDto: CreateThreadDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.threadService.createThread(createThreadDto, user.userId.toString());
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
  async updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDTO, @CurrentUser() user: User & { userId: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.threadService.updateThread(id, updateThreadDto, user.userId.toString());
  }

  @Delete(':id')
  async deleteThread(@Param('id') id: string, @CurrentUser() user: User & { userId: string, role: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.threadService.deleteThread(id, user.userId.toString(), user.role);
  }
}