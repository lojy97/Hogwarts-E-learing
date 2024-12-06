import { Controller, Get, Post, Body, Param, Put, Delete,Query,UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDTO } from './DTO/create-forum.dto';
import { UpdateForumDTO } from './DTO/update-forum.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';

// Apply the AuthGuard globally to all routes in this controller
@UseGuards(AuthGuard)
@Controller('forums')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  createForum(@Body() createForumDto: CreateForumDTO) {
    return this.forumService.createForum(createForumDto);
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
  updateForum(@Param('id') id: string, @Body() updateForumDto: UpdateForumDTO) {
    return this.forumService.updateForum(id, updateForumDto);
  }

  @Delete(':id')
  deleteForum(@Param('id') id: string) {
    return this.forumService.deleteForum(id);
  }

}
