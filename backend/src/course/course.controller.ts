import { Controller, Get, Post, Put, Delete, Body, Param, Req, ForbiddenException, UseGuards,Query,NotFoundException } from '@nestjs/common';
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
  constructor(private readonly coursesService: CourseService) {}

  @Post()
  @Roles(UserRole.Instructor, UserRole.Admin)
  async createCourse(
    @Body() createCourseDto: CreateCourseDTO,
    @CurrentUser() user: User & { userId: string }
  ) {
    console.log('User:', user);
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }

    return await this.coursesService.create(createCourseDto, user.userId, user.role);
  }
  @Get()
  async findAllCourses(@CurrentUser() user: User & { userId: string }) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }
    const userRole = user.role || UserRole.Student; // Default to Student
    return await this.coursesService.findAll(userRole, user.userId);
  }
  

  @Public()
@Get(':id([0-9a-fA-F]{24})') // Only match valid MongoDB ObjectIds
async findCourseById(
  @Param('id') id: string,
  @CurrentUser() user: User & { userId: string }
) {
  const userRole = user?.role || UserRole.Student;
  return await this.coursesService.findOne(id, userRole);
}

  

  @Put(':id')
  @Roles(UserRole.Instructor, UserRole.Admin)
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDTO,
    @CurrentUser() user: User & { userId: string }
  ) {
    const userRole = user.role;
    return await this.coursesService.update(id, updateCourseDto, userRole);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Instructor)
  async deleteCourse(
    @Param('id') id: string,
    @CurrentUser() user: User & { userId: string }
  ) {
    if (!user || !user.userId) {
      throw new UnauthorizedException('User ID is missing in the request.');
    }
  
    await this.coursesService.remove(id, user.role, user.userId);
    return { message: 'Course marked as unavailable' };
  }
  

  @Post(':id/rate')
  @Roles(UserRole.Student)
  async rateCourse(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @CurrentUser() user: User & { userId: string }
  ) {
    if (!user || user.role !== UserRole.Student) {
      throw new ForbiddenException('Only students can rate courses');
    }

    return await this.coursesService.addRating(
      new mongoose.Types.ObjectId(id),
      new mongoose.Types.ObjectId(user.userId),
      rating,
    );
  }

@Get('search-by-name')
async searchCoursesByName(
  @Query('name') name: string,
  @CurrentUser() user: User & { userId: string }
) {
  if (!user || !user.userId) {
    throw new UnauthorizedException('User ID is missing in the request.');
  }
  const userRole = user.role || UserRole.Student;
  return this.coursesService.searchByName(name, userRole, user.userId);
}


@Get('search')
async searchCourses(
  @Query('keyword') keyword: string,
  @CurrentUser() user: User & { userId: string }
) {
  if (!user || !user.userId) {
    throw new UnauthorizedException('User ID is missing in the request.');
  }
  const userRole = user.role || UserRole.Student;
  return this.coursesService.search(keyword, userRole, user.userId);
}

}
