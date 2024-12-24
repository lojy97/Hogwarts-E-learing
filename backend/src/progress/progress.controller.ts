import { Controller, Get, Post, Body, Param, Delete, Put,UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/createProgress.dto';
import { UpdateProgressDto } from './dto/updateProgress.dto';
import { Progress, progressDocument } from './models/progress.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
@UseGuards(AuthGuard)

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}


  @Post()
  async create(@Body() progressData: CreateProgressDto): Promise<progressDocument> {
    return await this.progressService.create(progressData);
  }


  @Get()
  async findAll(): Promise<progressDocument[]> {
    return await this.progressService.findAll();
  }@Get('/user/:userId/course/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<progressDocument | null> {
    return await this.progressService.findByUserIdAndCourseId(userId, courseId);
  }
  
  @Get(':id')
  async findById(@Param('id') id: string): Promise<progressDocument> {
    return await this.progressService.findById(id);
  }


  @Put(':id')
  
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateProgressDto,
  ): Promise<progressDocument> {
    return await this.progressService.update(id, updateData);
  }


  @Delete(':id')
  async delete(@Param('id') id: string): Promise<progressDocument> {
    return await this.progressService.delete(id);
  }
}
