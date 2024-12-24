import { Controller, Post, Body, UnauthorizedException, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/models/user.schema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  async createForum(@Body() createForumDto: CreateForumDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.createForum(createForumDto, user.userId.toString());
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
  async updateForum(@Param('id') id: string, @Body() updateForumDto: UpdateForumDTO, @CurrentUser() user: User & { userId: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.updateForum(id, updateForumDto, user.userId.toString());
  }

  @Delete(':id')
  async deleteForum(@Param('id') id: string, @CurrentUser() user: User & { userId: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.deleteForum(id, user.userId.toString());
  }
}import { Controller, Post, Body, UnauthorizedException, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/models/user.schema';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  async createForum(@Body() createForumDto: CreateForumDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.createForum(createForumDto, user.userId.toString());
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
  async updateForum(@Param('id') id: string, @Body() updateForumDto: UpdateForumDTO, @CurrentUser() user: User & { userId: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.updateForum(id, updateForumDto, user.userId.toString());
  }

  @Delete(':id')
  async deleteForum(@Param('id') id: string, @CurrentUser() user: User & { userId: string, role: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return this.forumService.deleteForum(id, user.userId.toString(), user.role);
  }
}