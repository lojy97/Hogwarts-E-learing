import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createQuizDTo } from './dto/creatquiz.dto';
import { UpdateQuizDto } from './dto/updatequiz.dto';
import { Quiz,quizDocument } from '../quizzes/models/quizzes.schema';
import {questions} from '../questions/models/questions.schema'
import {Module,ModuleDocument} from '../module/models/module.schema';

@Injectable()
export class QuizzesService {
   
        constructor(
            @InjectModel(Quiz.name) private quizModel: mongoose.Model<Quiz>,
            @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
            @InjectModel(questions.name) private readonly questionsModel: Model<questions>,

        ) {}
       
        async create(quizData: Quiz): Promise<quizDocument> {
            const newQuiz= new this.quizModel(quizData); 
            const module = await this.moduleModel.findById(newQuiz.Module_id);
            const questionBank=await this.questionsModel.findById(module.questionBank_id);
           // const  nQuestions=newQuiz.quizQuestions;
            for(let i=0;i<newQuiz.questionsIMCQ.length;i++){
                newQuiz.quizQuestions.push(questionBank.mcq[newQuiz.questionsIMCQ[i]]);
            }

            for(let i=0;i<newQuiz.questionsITF.length;i++){
                newQuiz.quizQuestions.push(questionBank.tf[newQuiz.questionsITF[i]]);
            }
           
            return await newQuiz.save(); 
        }


        async update(id: string, updateData: UpdateQuizDto): Promise<quizDocument> {

            const updated= await this.quizModel.findByIdAndUpdate(id, updateData, { new: true }); 
            const module = await this.moduleModel.findById(updated.Module_id);
            const questionBank=await this.questionsModel.findById(module.questionBank_id);

            for(let i=0;i<updated.questionsIMCQ.length;i++){
                updated.quizQuestions.push(questionBank.mcq[updated.questionsIMCQ[i]]);
            }

            for(let i=0;i<updated.questionsITF.length;i++){
                updated.quizQuestions.push(questionBank.tf[updated.questionsITF[i]]);
            }
                return updated;
            
            
        }

        async findById(id: string): Promise<quizDocument> {
            return await this.quizModel.findById(id);  // Fetch a student by ID
        }

        async delete(id: string): Promise<quizDocument> {
            return await this.quizModel.findByIdAndDelete(id);  
        }

}
