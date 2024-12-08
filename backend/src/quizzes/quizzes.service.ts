import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createQuizDTo } from './dto/creatquiz.dto';
import { UpdateQuizDto } from './dto/updatequiz.dto';
import {Quiz,quizDocument,quizzesSchema } from '../quizzes/models/quizzes.schema';
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
            if (!module) {
                throw new Error(`Module with ID ${newQuiz.Module_id} not found.`);
              }
            const questionBank=await this.questionsModel.findById(module.questionBank_id);
        
            for(let i=0;i<newQuiz.MCQ;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.mcq.length);
                let selectedQuestion = questionBank.mcq[rnadomI];
                let alreadyExists = newQuiz.quizQuestions.some(q => q.id === selectedQuestion.id);
                if (!alreadyExists) {
                 newQuiz.quizQuestions.push(questionBank.mcq[rnadomI]);
            }
            i--;
        }

            for(let i=0;i<newQuiz.TF;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.tf.length);
                let selectedQuestion = questionBank.tf[rnadomI];
                let alreadyExists = newQuiz.quizQuestions.some(q => q.id === selectedQuestion.id);
                if (!alreadyExists) {
                 newQuiz.quizQuestions.push(questionBank.tf[rnadomI]);
            }
            i--;
            }
           
            return await newQuiz.save(); 
        }


        async update(id: string, updateData: UpdateQuizDto): Promise<quizDocument> {

            const updated= await this.quizModel.findByIdAndUpdate(id, updateData, { new: true }); 
            const module = await this.moduleModel.findById(updated.Module_id);
            const questionBank=await this.questionsModel.findById(module.questionBank_id);

            for(let i=0;i<updated.MCQ;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.mcq.length);
                let selectedQuestion = questionBank.mcq[rnadomI];
                let alreadyExists = updated.quizQuestions.some(q => q.id === selectedQuestion.id);
                if (!alreadyExists) {
                    updated.quizQuestions.push(questionBank.mcq[rnadomI]);
            }
            i--;
        }

            for(let i=0;i<updated.TF;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.tf.length);
                let selectedQuestion = questionBank.tf[rnadomI];
                let alreadyExists = updated.quizQuestions.some(q => q.id === selectedQuestion.id);
                if (!alreadyExists) {
                    updated.quizQuestions.push(questionBank.tf[rnadomI]);
            }
            i--;
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
