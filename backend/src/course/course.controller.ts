import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly coursesService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Instructor)
  async createCourse(@Body() createCourseDto: CreateCourseDTO) {
    return await this.coursesService.create(createCourseDto);
  }

  @Public()
  @Get()
  async findAllCourses(@Req() req) {
    const userRole = req.user?.role || UserRole.Student; // Default to student if not logged in
    return await this.coursesService.findAll(userRole);
  }

  @Public()
  @Get(':id')
  async findCourseById(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role || UserRole.Student; // Default to student if not logged in
    return await this.coursesService.findOne(id, userRole);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDTO) {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Instructor, UserRole.Admin)
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
