import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './models/course.schema';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { UserRole } from '../user/models/user.schema';
import { UserService } from 'src/user/user.service';
import * as mongoose from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    private readonly userService: UserService,  
  ) {}
  async create(createCourseDto: CreateCourseDTO, userRole: UserRole): Promise<Course> {
    // Only instructors or admins are allowed to create a course
    if (userRole !== UserRole.Instructor && userRole !== UserRole.Admin) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    const createdCourse = new this.courseModel({ ...createCourseDto, ratingCount: 0, averageRating: 0 });
    return createdCourse.save();
  }
 

  async findAll(userRole: UserRole): Promise<Course[]> {
    if (userRole === UserRole.Student) {
      return this.courseModel.find({ isOutdated: false }).exec(); 
    }
    return this.courseModel.find().exec(); 
  }

  // Find a single course 
  async findOne(id: string, userRole: UserRole): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) throw new NotFoundException('Course not found');

    // Students cannot access outdated or unavailable courses
    if (userRole === UserRole.Student && (!course.isAvailable || course.isOutdated)) {
      throw new NotFoundException('Course is not accessible');
    }

    return course;
  }

  // Update a course (only for instructors or admins)
  async update(id: string, updateCourseDto: UpdateCourseDTO, userRole: UserRole): Promise<Course> {
    if (userRole !== UserRole.Instructor && userRole !== UserRole.Admin) {
      throw new ForbiddenException('Only instructors or admins can update courses');
    }

    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true,
    });
    if (!updatedCourse) throw new NotFoundException('Course not found');
    return updatedCourse;
  }

  // Add a rating to a course
  async addRating(courseId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, rating: number): Promise<Course> {
    // Find the course by its ObjectId
    const course = await this.courseModel.findById(courseId); 
    if (!course) throw new NotFoundException('Course not found');

    if (!course.isAvailable || course.isOutdated) {
      throw new ForbiddenException('Cannot rate an unavailable or outdated course');
    }

    const isEnrolled = await this.userService.hasCourse(userId.toString(), courseId.toString());
    if (!isEnrolled) {
      throw new ForbiddenException('You must be enrolled in the course to rate it');
    }

    course.ratingCount += 1;
    course.averageRating =
      ((course.averageRating * (course.ratingCount - 1)) + rating) / course.ratingCount;

    return course.save();
  }

  // Soft delete a course (mark as unavailable)
  async remove(id: string): Promise<void> {
    const course = await this.courseModel.findByIdAndDelete(id); 
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  }
  
}
