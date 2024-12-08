import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards,UnauthorizedException,Req,HttpException, HttpStatus } from '@nestjs/common';
import { ThreadService } from './threads.service';
import { CreateThreadDTO } from './DTO/create-thread.dto';
import { UpdateThreadDTO } from './DTO/update-thread.dto';
import { CreateReplyDTO } from '../reply/DTO/create-reply.dto'; // Import for replies
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
@UseGuards(AuthGuard)
@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  async createThread(@Body() createThreadDto: CreateThreadDTO, @Req() req: Request) {
    // Get userId from request (assumed it's available in the headers or JWT token)
    const userId = req.headers['user-id']; // or req.user.id if you set user in JWT

    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.threadService.createThread(createThreadDto, userId as string);
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
  async updateThread(
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDTO,
    @Req() req: Request, // Access the request to get user information
  ) {
    const userId = req.headers['user-id']; // or req.user.id if you're using JWT
    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }
    return this.threadService.updateThread(id, updateThreadDto, userId as string);
  }

  @Delete(':id')
  async deleteThread(@Param('id') id: string, @Req() request: any): Promise<any> {
    try {
      const userId = request.user.id;
      return await this.threadService.deleteThread(id, userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting the thread',
        HttpStatus.FORBIDDEN
      );
    }
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
