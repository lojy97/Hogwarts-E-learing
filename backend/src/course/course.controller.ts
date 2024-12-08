import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req , ForbiddenException} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import * as mongoose from 'mongoose';

@Controller('course')
export class CourseController {
  constructor(private readonly coursesService: CourseService) {}

  @Post()
 
  async createCourse(@Body() createCourseDto: CreateCourseDTO, @Req() req) {
    const userRole = req.user.role;
    return await this.coursesService.create(createCourseDto, userRole);
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
  
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDTO,
    @Req() req,
  ) {
    const userRole = req.user.role;
    return await this.coursesService.update(id, updateCourseDto, userRole);
  }

  @Delete(':id')
 
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
  @Post(':id/rate')

async rateCourse(
  @Param('id') id: string, 
  @Body('rating') rating: number,
  @Req() req,
) {
  const userId = req.user._id; 
  
  
  const userRole = req.user.role;
  if (userRole !== UserRole.Student) {
    throw new ForbiddenException('Only students can rate courses');
  }

  const courseIdAsObjectId = new mongoose.Types.ObjectId(id);
  const userIdAsObjectId = new mongoose.Types.ObjectId(userId);

  return await this.coursesService.addRating(courseIdAsObjectId, userIdAsObjectId, rating);
}

}
