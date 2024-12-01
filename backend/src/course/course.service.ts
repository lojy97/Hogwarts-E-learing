import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as mongoose from 'mongoose'
import {Course} from '../course/models/course.schema';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { CreateCourseDTO } from './dto/create-course.dto';


@Injectable()
export class CourseService {
    constructor(@InjectModel(Course.name) private courseModel: mongoose.Model<Course>) {}

    async create(createCourseDto: CreateCourseDTO): Promise<Course> {
      const newCourse = new this.courseModel(createCourseDto);
      return newCourse.save();
    }
  
    async findAll(): Promise<Course[]> {
      return this.courseModel.find().exec();
    }
  
    async findOne(id: string): Promise<Course> {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    }
  
    async update(id: string, updateCourseDto: UpdateCourseDTO): Promise<Course> {
      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, updateCourseDto, { new: true })
        .exec();
      if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return updatedCourse;
    }
  
    async remove(id: string): Promise<void> {
      const result = await this.courseModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
    }
  }