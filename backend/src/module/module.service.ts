import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/module.schema';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';
import { UserService } from '../user/user.service';  // Assuming you have a UserService to fetch user data
import { UserRole } from 'src/user/models/user.schema';
import { Express } from 'express';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly userService: UserService, // Inject UserService for accessing user data
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

    Object.assign(module, updateModuleDto);
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
