import { Controller, Get, Post, Put, Delete, Body, Param, Req, ForbiddenException, UseGuards,Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { Public } from 'src/auth/decorators/public.decorator';
import * as mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.schema';
import { UnauthorizedException } from '@nestjs/common';


@UseGuards(AuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly coursesService: CourseService) { }

  @Post()
  @Roles(UserRole.Instructor, UserRole.Admin)
  async createCourse(@Body() createCourseDto: CreateCourseDTO, @CurrentUser() user: User & { userId: string }) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return await this.coursesService.create(createCourseDto, user.userId);
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
    const userRole = req.user?.role || UserRole.Student;
    return await this.coursesService.findOne(id, userRole);
  }

  @Put(':id')
  @Roles(UserRole.Instructor, UserRole.Admin)
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDTO,
    @Req() req,
  ) {
    const userRole = req.user.role;
    return await this.coursesService.update(id, updateCourseDto, userRole);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Instructor)
  async deleteCourse(@Param('id') id: string) {
    await this.coursesService.remove(id);
    return { message: 'Course marked as unavailable' };
  }

  @Post(':id/rate')
  @Roles(UserRole.Student)
  async rateCourse(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Req() req,
  ) {
    const userId = req.user['_id'];

    if (req.user['role'] !== UserRole.Student) {
      throw new ForbiddenException('Only students can rate courses');
    }

    return await this.coursesService.addRating(
      new mongoose.Types.ObjectId(id),
      new mongoose.Types.ObjectId(userId),
      rating,
    );
  }
  @Get('search')
  @Roles(UserRole.Student, UserRole.Instructor, UserRole.Admin)
  async searchCourses(@Query('keyword') keyword: string, @Req() req: any) {
    const userRole = req.user.role; // Assume user role is extracted from the request
    return this.coursesService.search(keyword, userRole);
  }
  @Get('search-by-name')
  @Roles(UserRole.Student, UserRole.Instructor, UserRole.Admin)
  async searchCoursesByName(@Query('name') name: string, @Req() req: any) {
    const userRole = req.user.role; // Extract user role from the request
    return this.coursesService.searchByName(name, userRole);
  }
}