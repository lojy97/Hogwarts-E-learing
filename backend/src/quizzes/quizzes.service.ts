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
            newQuiz.TF=module.TFcount;
            newQuiz.MCQ=module.MCQcount;
            if (!module) {
                throw new Error(`Module with ID ${newQuiz.Module_id} not found.`);
              }
            const questionBank=await this.questionsModel.findById(module.questionBank_id);
            if (newQuiz.MCQ>questionBank.mcq.length) {
                throw new Error(`number of MCQs selected exceeds the number of MCQs in this module's question bank  `);
              }
              if (newQuiz.TF>questionBank.tf.length) {
                throw new Error(`number of true or false questions selected exceeds the number of true or false questions in this module's question bank  `);
              }

            let selectedImcq:number[] = [-1];
            for(let i=0;i<newQuiz.MCQ;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.mcq.length);
               
                if(!selectedImcq.includes(rnadomI)){
                 newQuiz.quizQuestions.push(questionBank.mcq[rnadomI]);
                 selectedImcq.push(rnadomI);
                }
                else i--;
           
        }
        let selectedItf :number[] = [-1];
            for(let i=0;i<newQuiz.TF;i++){

                let rnadomI=Math.floor(Math.random()*questionBank.tf.length);
                if(!selectedItf.includes(rnadomI)){
                 newQuiz.quizQuestions.push(questionBank.tf[rnadomI]);
                 selectedItf.push(rnadomI);
                }
                else i--;
          
            }
            return await newQuiz.save(); 
        }


        async update(id: string, updateData: UpdateQuizDto): Promise<quizDocument> {

            const updated= await this.quizModel.findByIdAndUpdate(id, updateData, { new: true }); 
            const module = await this.moduleModel.findById(updated.Module_id);
            const questionBank=await this.questionsModel.findById(module.questionBank_id);
            if (updated.MCQ>questionBank.mcq.length) {
                throw new Error(`number of MCQs selected exceeds the number of MCQs in this module's question bank  `);
              }
              if (updated.TF>questionBank.tf.length) {
                throw new Error(`number of true or false questions selected exceeds the number of true or false questions in this module's question bank  `);
              }

            let selectedImcq:number[] = [-1];
            for(let i=0;i<updated.MCQ;i++){
                let rnadomI=Math.floor(Math.random()*questionBank.mcq.length);
               
                if(!selectedImcq.includes(rnadomI)){
                    updated.quizQuestions.push(questionBank.mcq[rnadomI]);
                 selectedImcq.push(rnadomI);
                }
                else i--;
           
        }
        let selectedItf :number[] = [-1];
            for(let i=0;i<updated.TF;i++){

                let rnadomI=Math.floor(Math.random()*questionBank.tf.length);
                if(!selectedItf.includes(rnadomI)){
                    updated.quizQuestions.push(questionBank.tf[rnadomI]);
                 selectedItf.push(rnadomI);
                }
                else i--;
          
            }
           
                return updated;
            
            
        }

       async findById(id: string): Promise<quizDocument> {
            return await this.quizModel.findById(id);  
        }

        async delete(id: string): Promise<quizDocument> {
            return await this.quizModel.findByIdAndDelete(id);  
        }

}
