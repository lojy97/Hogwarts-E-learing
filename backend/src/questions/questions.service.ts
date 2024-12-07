import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { questions, questionsDocument } from './models/questions.schema';
import { createQuestionDto } from './dto/createQuestion.dto';
import { updateQuestionDto } from './dto/updateQuestions.dto';


@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(questions.name) private questionsModel: mongoose.Model<questions>
    ) { }

 
    async create(questionsData: questions): Promise<questionsDocument> {
        const newQuestions = new this.questionsModel(questionsData);  
        return await newQuestions.save(); 
    }
    async findByID(id:string):Promise<questionsDocument>{
        const QB=await this.questionsModel.findById(id);
        return QB;
    }
    async findInMCQ(id:string,qIndex: number):Promise<{question:String,correctAnswer:String}> {
        const QB=this.findByID(id);
       const mcq=(await QB).mcq;
       return mcq[qIndex];
    }

    async findInTF(id:string,qIndex: number):Promise<{question:String,correctAnswer:String}> {
        const QB=this.findByID(id);
       const tf=(await QB).tf;
       return tf[qIndex];
    }

    async findAll():Promise<questionsDocument[]>{
        let QB=await this.questionsModel.find();
        return QB;
    }
    
    async delete(id: string): Promise<questionsDocument> {
        return await this.questionsModel.findByIdAndDelete(id);
    }
    async update(id: string, updateData: updateQuestionDto): Promise<questionsDocument> {
        return await this.questionsModel.findByIdAndUpdate(id, updateData, { new: true });  
    }


}
