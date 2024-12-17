import { Injectable, NotFoundException, ForbiddenException,InternalServerErrorException } from '@nestjs/common';
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
  async create(createCourseDto: CreateCourseDTO, userId: string, userRole: UserRole): Promise<Course> {
    if (userRole !== UserRole.Instructor && userRole !== UserRole.Admin) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    const createdCourse = new this.courseModel({
      ...createCourseDto,
      createdBy: new mongoose.Types.ObjectId(userId), // Automatically set createdBy from logged-in user
      keywords: createCourseDto.keywords || [],
      ratingCount: 0,
      averageRating: 0,
      isOutdated: false, 
      isAvailable: true, 
    });
    return createdCourse.save();
  }
  // Find all courses 
  async findAll(userRole: UserRole, userId: string): Promise<Course[]> {
    if (userRole === UserRole.Student) {
      // Students can only see courses that are available and not outdated
      return this.courseModel.find({ isAvailable: true, isOutdated: false }).exec();
    }
  
    if (userRole === UserRole.Instructor) {
      // Instructors see:
      // - Courses they created (all, regardless of availability or outdated status)
      // - Courses created by others that are available and not outdated
      return this.courseModel.find({
        $or: [
          { createdBy: userId }, // Show all courses created by this instructor
          { isAvailable: true, isOutdated: false, createdBy: { $ne: userId } }, // Exclude outdated/unavailable from others
        ],
      }).exec();
    }
  
    // Admins can see all courses
    return this.courseModel.find().exec();
  }
  

  // Find a single course (consider flags and user role)
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
  async remove(id: string, userRole: UserRole, userId: string): Promise<void> {
    let course;
  
    if (userRole === UserRole.Admin) {
      // Admin can mark any course as unavailable
      course = await this.courseModel.findByIdAndUpdate(
        id,
        { isAvailable: false },
        { new: true }
      );
    } else if (userRole === UserRole.Instructor) {
      // Instructor can only mark courses they created as unavailable
      course = await this.courseModel.findOneAndUpdate(
        { _id: id, createdBy: userId },
        { isAvailable: false },
        { new: true }
      );
    }
  
    if (!course) {
      throw new NotFoundException('Course not found or you do not have permission to update it');
    }
  }
  
  async searchByName(name: string, userRole: UserRole, userId: string): Promise<Course[]> {
    if (userRole === UserRole.Admin) {
      // Admins can see all courses
      return this.courseModel.find({
        name: { $regex: name, $options: 'i' },
      }).exec();
    } else if (userRole === UserRole.Instructor) {
      // Instructors can see their courses + public (available and not outdated) courses
      return this.courseModel.find({
        $or: [
          { createdBy: userId }, // Courses created by the instructor
          { isAvailable: true, isOutdated: false }, // Public courses
        ],
        name: { $regex: name, $options: 'i' },
      }).exec();
    } else {
      // Students can only see available and not outdated courses
      return this.courseModel.find({
        isAvailable: true,
        isOutdated: false,
        name: { $regex: name, $options: 'i' },
      }).exec();
    }
  }
  
  async search(keyword: string, userRole: UserRole, userId: string): Promise<Course[]> {
    if (userRole === UserRole.Admin) {
      // Admins can see all courses
      return this.courseModel.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }).exec();
    } else if (userRole === UserRole.Instructor) {
      // Instructors can see their courses + public (available and not outdated) courses
      return this.courseModel.find({
        $or: [
          { createdBy: userId, name: { $regex: keyword, $options: 'i' } },
          { createdBy: userId, description: { $regex: keyword, $options: 'i' } },
          { isAvailable: true, isOutdated: false, name: { $regex: keyword, $options: 'i' } },
          { isAvailable: true, isOutdated: false, description: { $regex: keyword, $options: 'i' } },
        ],
      }).exec();
    } else {
      // Students can only see available and not outdated courses
      return this.courseModel.find({
        isAvailable: true,
        isOutdated: false,
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }).exec();
    }
  }
  
  
}
