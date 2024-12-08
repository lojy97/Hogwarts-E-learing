import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './models/course.schema';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { UserRole } from '../user/models/user.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

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

  async findOne(id: string, userRole: UserRole): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) throw new NotFoundException('Course not found');

    if (userRole === UserRole.Student && course.isOutdated) {
      throw new NotFoundException('Course is outdated and not accessible');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDTO, userRole: UserRole): Promise<Course> {
    // Only instructors or admins are allowed to update the course
    if (userRole !== UserRole.Instructor && userRole !== UserRole.Admin) {
      throw new ForbiddenException('Only instructors or admins can update courses');
    }

    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true,
    });
    if (!updatedCourse) throw new NotFoundException('Course not found');
    return updatedCourse;
  }
  async addRating(id: string, rating: number): Promise<Course> {
    const course = await this.courseModel.findById(id);
    if (!course) throw new NotFoundException('Course not found');

    course.ratingCount += 1;
    course.averageRating = 
      ((course.averageRating * (course.ratingCount - 1)) + rating) / course.ratingCount;

    return course.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Course not found');
  }
}
