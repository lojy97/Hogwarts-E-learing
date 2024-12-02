import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { NotFoundException } from '@nestjs/common';

@UseGuards(RolesGuard)
    @Roles(UserRole.Instructor)
@Controller('course')
export class CourseController {
  constructor(private readonly coursesService: CourseService) {}

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDTO) {
    return await this.coursesService.create(createCourseDto);
  }
 @Public()
  @Get()
  async findAllCourses() {
    return await this.coursesService.findAll();
  }
@Public()
  @Get(':id')
  async findCourseById(@Param('id') id: string) {
    return await this.coursesService.findOne(id);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDTO) {
    return await this.coursesService.update(id, updateCourseDto);
  }
  @Public()
  @Get('title/:title')
  async findCourseByTitle(@Param('title') title: string) {
    try {
      // Call the service method to find the course by title
      const course = await this.coursesService.findByTitle(title);
      return course;
    } catch (error) {
      // In case of an error, return a proper error message
      throw new NotFoundException('Course not found');
    }
  }
  @UseGuards(RolesGuard)
    @Roles(UserRole.Instructor)
    @Roles(UserRole.Admin)
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
