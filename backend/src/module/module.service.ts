import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/module.schema';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { UserService } from '../user/user.service';  // Assuming you have a UserService to fetch user data
import { UserRole } from 'src/user/models/user.schema';
import { Express } from 'express';
import { Course } from 'src/course/models/course.schema';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly userService: UserService,
    private readonly CourseService: CourseService,
  ) {}



  // Create a new module
  async create(createModuleDto: CreateModuleDTO): Promise<Module> {
    if (createModuleDto.mediaFiles && createModuleDto.mediaFiles.length > 0) {
      // Ensure the media files have the correct structure for the DTO
      createModuleDto.mediaFiles = createModuleDto.mediaFiles.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
      }));
    }
    const module = new this.moduleModel(createModuleDto);
    return await module.save();
  }

  // Fetch all modules
  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().populate('courseId').exec();
  }

  // Fetch module by ID
  async findById(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).populate('courseId').exec();
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  // Update module
  async update(id: string, updateModuleDto: UpdateModuleDTO, userId: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) throw new NotFoundException('Module not found');

    if (module.creator.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this module');
    }

<<<<<<< HEAD
    Object.assign(module, updateModuleDto);
=======
    return module;
  }
  async findByCourse(course_id: string): Promise<Module[]> {

    const module = await this.moduleModel
      .find({ courseId:course_id })  
      .exec();

    if (module.length==0) {
     console.log('no Modules for this course were found');
    }

    return module;
  }
  // Delete module (only by Admin or Instructor)
  async delete(id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Module not found');
    }
  }

  // Add a rating to a module (only by students enrolled in the course)
  async addRating(moduleId: string, rating: number, userId: string): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Get the courseId associated with the module
    const courseId = module.courseId.toString(); // Convert to string to compare with user courses

    // Check if the user is enrolled in the course
    const isEnrolled = await this.userService.hasCourse(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenException('You must be enrolled in the course to rate this module');
    }

    // Add the rating
    module.ratingCount += 1;
    module.averageRating = 
      (module.averageRating * (module.ratingCount - 1) + rating) / module.ratingCount;

>>>>>>> 7c7906da349b30b6f570ba517b0cc0f0318b5191
    return await module.save();
  }

  // Delete module
  async delete(id: string, userId: string): Promise<void> {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) throw new NotFoundException('Module not found');

    if (module.creator.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this module');
    }

    await this.moduleModel.findByIdAndDelete(id).exec();
  }

  // Search module by title
  async findByTitle(title: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ title: new RegExp(`^${title}$`, 'i') })
      .exec();
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }
}
