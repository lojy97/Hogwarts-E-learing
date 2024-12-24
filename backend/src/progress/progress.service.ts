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
import { Response } from 'src/responses/models/responses.schema';


@Injectable()
export class ProgressService {

    constructor(
        @InjectModel(Progress.name) private progressModel: mongoose.Model<Progress>,
        @InjectModel(Course.name) private readonly courseModel: Model<Course>,
        @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
        @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
        @InjectModel(Response.name)private readonly responseModel:Model<Response>
    ) {}

   
    async create(progressData: Progress): Promise<progressDocument> {
        const newProgress= new this.progressModel(progressData); 
        const Course=await this.courseModel.findById(newProgress.course_id);
        const totalModules = await this.moduleModel.countDocuments({ course_id: newProgress.course_id });
        const accessedModulesCount=newProgress.accessed_modules.length;

        /*if(newProgress.performanceMetric==="Intermediate")
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
             }*/    

      
             let totalScores=0;
             if(totalModules!=0)
             newProgress.completion_percentage=(accessedModulesCount/totalModules)*100;
else newProgress.completion_percentage=0;
             for(let i=0;i<newProgress.accessed_modules.length;i++){
              let module=  await this.moduleModel.findById(newProgress.accessed_modules[i]);
              let quiz=await this.quizModel.findById(module.quiz_id);
              
              try{
                
              let response=await this.responseModel.findOne({quiz_id:quiz.id,user_id:newProgress.user_id})
              totalScores+=response.score;
              }catch{
                console.log("no response matched quiz id:"+quiz.id+"user id: "+newProgress.user_id);
              }
              
             }
             if(totalModules!=0)
             newProgress.avgScore=(totalScores/(totalModules*100));
             else newProgress.completion_percentage=0;
             
        return await newProgress.save(); 
    }
    async findAll(): Promise<progressDocument[]> {
        let responses=await this.progressModel.find();
        return responses;
      }
      async findByUserIdAndCourseId(
        userId: string,
        courseId: string,
      ): Promise<progressDocument | null> {
        const progress = await this.progressModel.findOne({ user_id: userId, course_id: courseId });
        if (!progress) {
          console.error(`Progress not found for user ${userId} and course ${courseId}`);
        }
        return progress;
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
