import { Injectable, NotFoundException, ConflictException,ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/module.schema';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { UserService } from '../user/user.service';  // Assuming you have a UserService to fetch user data

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly userService: UserService, // Inject UserService for accessing user data
  ) {}

  // Create a new module (only by Instructor or Admin)
  async create(createModuleDto: CreateModuleDTO): Promise<Module> {
    try {
      const module = new this.moduleModel(createModuleDto);
      return await module.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A module with this ID already exists.');
      }
      throw error;
    }
  }

  // Get all modules (available for all users)
  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().populate('courseId').exec();
  }

  // Find module by ID
  async findById(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).populate('courseId').exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  // Update module (only by Admin)
  async update(id: string, updateModuleDto: UpdateModuleDTO): Promise<Module> {
    const module = await this.moduleModel.findByIdAndUpdate(id, updateModuleDto, {
      new: true,
    }).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  // Find module by title (case-insensitive search)
  async findByTitle(title: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ title: new RegExp('^' + title.trim() + '$', 'i') })  // Case-insensitive match
      .exec();

    if (!module) {
      throw new NotFoundException('Module not found');
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

    return await module.save();
  }
}
