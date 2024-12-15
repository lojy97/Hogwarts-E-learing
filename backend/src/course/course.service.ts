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

  // Create a new course
  async create(createCourseDto: CreateCourseDTO, userRole: UserRole): Promise<Course> {
    if (userRole !== UserRole.Instructor && userRole !== UserRole.Admin) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }
    if (!createCourseDto.keywords || createCourseDto.keywords.length === 0) {
      throw new ForbiddenException('Keywords are required when creating a course');
    }
  

    const createdCourse = new this.courseModel({
      ...createCourseDto,
      ratingCount: 0,
      averageRating: 0,
      isOutdated: false, 
      isAvailable: true, 
    });
    return createdCourse.save();
  }

  // Find all courses (consider flags and user role)
  async findAll(userRole: UserRole): Promise<Course[]> {
    if (userRole === UserRole.Student) {
      // Students can only see courses that are available and not outdated
      return this.courseModel.find({ isAvailable: true, isOutdated: false }).exec();
    }
    // Admins and instructors can see all courses
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
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { new: true },
    );
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  }
  async search(keyword: string, userRole: UserRole): Promise<Course[]> {
    const searchCriteria: any = {
      keywords: { $regex: keyword, $options: 'i' }, // Case-insensitive partial match for the keyword
    };
  
    // Apply additional filters based on the user role
    if (userRole === UserRole.Student) {
      searchCriteria.isAvailable = true;
      searchCriteria.isOutdated = false;
    } 
  
    return this.courseModel.find(searchCriteria).exec();
  }
  async searchByName(name: string, userRole: UserRole): Promise<Course[]> {
    const searchCriteria: any = {
      name: { $regex: name, $options: 'i' }, // Case-insensitive partial match for the name
    };
  
    // Apply additional filters based on the user role
    if (userRole === UserRole.Student) {
      searchCriteria.isAvailable = true;
      searchCriteria.isOutdated = false;
    }
  
    return this.courseModel.find(searchCriteria).exec();
  }
  
  
}
