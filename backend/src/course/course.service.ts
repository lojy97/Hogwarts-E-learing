import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './models/course.schema';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { UserRole } from '../user/models/user.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(createCourseDto: CreateCourseDTO): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAll(userRole: UserRole): Promise<Course[]> {
    if (userRole === UserRole.Student) {
      return this.courseModel.find({ isOutdated: false }).exec(); // Only non-outdated courses
    }
    return this.courseModel.find().exec(); // All courses for instructors/admins
  }

  async findOne(id: string, userRole: UserRole): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) throw new NotFoundException('Course not found');

    if (userRole === UserRole.Student && course.isOutdated) {
      throw new NotFoundException('Course is outdated and not accessible');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDTO): Promise<Course> {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true,
    });
    if (!updatedCourse) throw new NotFoundException('Course not found');
    return updatedCourse;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Course not found');
  }
}
