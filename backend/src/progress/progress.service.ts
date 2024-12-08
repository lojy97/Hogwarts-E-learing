import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Quiz,quizDocument,quizzesSchema } from '../quizzes/models/quizzes.schema';
import {questions} from '../questions/models/questions.schema'
import {Module,ModuleDocument} from '../module/models/module.schema';//dep
import { Progress,progressDocument } from './models/progress.schema';
import { Course } from 'src/course/models/course.schema';//dep
import { UpdateProgressDto } from './dto/updateProgress.dto';

@Injectable()
export class ProgressService {

    constructor(
        @InjectModel(Progress.name) private progressModel: mongoose.Model<Progress>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
    ) {}

   
    async create(progressData: Progress): Promise<progressDocument> {
        const newProgress= new this.progressModel(progressData); 
   
        const Course=await this.courseModel.findById(newProgress.course_id);
        const totalModules = await this.moduleModel.countDocuments({ course_id: newProgress.course_id });
        let accessedModules;
        if(newProgress.performanceMetric==="Intermediate")
            accessedModules = await this.moduleModel.find({
                $and: [
                  { course_id: newProgress.course_id },
                  {
                    $or: [
                      { difficulty: newProgress.performanceMetric },
                      { difficulty: 'Beginner' }
                    ]
                  }
                ]
              });


             else{ if(newProgress.performanceMetric==="Advanced")
                accessedModules = await this.moduleModel.find({course_id: newProgress.course_id });
                else{
                    accessedModules = await this.moduleModel.find({course_id: newProgress.course_id,difficulty:"Beginner" });
                }
             }    

      
             
        const accessedModulesCount=accessedModules.length;

             newProgress.completion_percentage=(accessedModulesCount/totalModules)*100;


        return await newProgress.save(); 
    }
    async findAll(): Promise<progressDocument[]> {
        let responses=await this.progressModel.find();
        return responses;
      }
    
      async findById(id: string): Promise<progressDocument> {
        return await this.progressModel.findById(id);
      }
    
      async delete(id: string): Promise<progressDocument> {
       return  await this.progressModel.findByIdAndDelete(id);
      }
      async update(id: string, updateData: UpdateProgressDto): Promise<progressDocument> {
        return await this.progressModel.findByIdAndUpdate(id, updateData, { new: true });  
    }
}
