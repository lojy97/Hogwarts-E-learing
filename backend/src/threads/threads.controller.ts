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
<<<<<<< HEAD
   // Ensure the user is authenticated
  async createThread(@Body() createThreadDto: CreateThreadDTO) {
    return this.threadService.createThread(createThreadDto);
=======
  async createThread(@Body() createThreadDto: CreateThreadDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.threadService.createThread(createThreadDto, user.userId.toString());
>>>>>>> master
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
<<<<<<< HEAD
   // Ensure the user is authenticated
  async updateThread(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDTO) {
    return this.threadService.updateThread(id, updateThreadDto);
  }

  @Delete(':id')
    // Ensure the user is authenticated
  async deleteThread(@Param('id') id: string) {
    return this.threadService.deleteThread(id);  // This will also remove the thread from the Forum
  }
=======
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
>>>>>>> master

    return this.threadService.deleteThread(id, user.userId.toString(), user.role);
  }
}