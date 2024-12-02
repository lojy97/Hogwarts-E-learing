import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './models/module.schema';
import { CreateModuleDTO } from './dto/create-module.dto';
import { UpdateModuleDTO } from './dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
  ) {}

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

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().populate('courseId').exec();
  }

  async findById(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).populate('courseId').exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDTO): Promise<Module> {
    const module = await this.moduleModel.findByIdAndUpdate(id, updateModuleDto, {
      new: true,
    }).exec();
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }
  async findByTitle(title: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ title: new RegExp('^' + title.trim() + '$', 'i') })  // Case-insensitive match
      .exec();

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }
  async delete(id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Module not found');
    }
  }
}
