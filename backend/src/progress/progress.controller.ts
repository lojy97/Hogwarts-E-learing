import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/createProgress.dto';
import { UpdateProgressDto } from './dto/updateProgress.dto';
import { Progress, progressDocument } from './models/progress.schema';

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
