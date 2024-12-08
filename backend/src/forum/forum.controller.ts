import { Controller, Get, Post, Body, Param, Put, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { Request } from 'express';

@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  createForum(@Body() createForumDto: CreateForumDTO, @Req() req: Request) {
    
    const userId = req.headers['user-id']; 

    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.createForum(createForumDto, userId as string);
  }

  @Get()
  getForums() {
    return this.forumService.getForums();
  }

  @Get(':id')
  getForumById(@Param('id') id: string) {
    return this.forumService.getForumById(id);
  }

  @Put(':id')
  updateForum(
    @Param('id') id: string,
    @Body() updateForumDto: UpdateForumDTO,
    @Req() req: Request, // Get user info from request
  ) {
    // Extract userId directly from the request
    const userId = req.headers['user-id']; 

    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.updateForum(id, updateForumDto, userId as string);
  }

  @Delete(':id')
  deleteForum(
    @Param('id') id: string,
    @Req() req: Request, // Get user info from request
  ) {
    // Extract userId directly from the request
    const userId = req.headers['user-id']; 

    if (!userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.deleteForum(id, userId as string);
  }
}
