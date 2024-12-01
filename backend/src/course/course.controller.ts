import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly coursesService: CourseService) {}

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDTO) {
    return await this.coursesService.create(createCourseDto);
  }

  @Get()
  async findAllCourses() {
    return await this.coursesService.findAll();
  }

  @Get(':id')
  async findCourseById(@Param('id') id: string) {
    return await this.coursesService.findOne(id);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDTO) {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
