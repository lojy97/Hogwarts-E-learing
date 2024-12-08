import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Response,responseDocument } from './models/responses.schema';
import { CreateResponseDto } from './dto/creatresponse.dto';
import { UpdateResponseDto } from './dto/updateresponse.dto';
import { Quiz,quizDocument } from '../quizzes/models/quizzes.schema';

@Injectable()
export class ResponsesService {
  
  constructor(@InjectModel(Response.name) private responseModel: Model<Response>,
            @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,) {}


  async create(ResponseData: Response ): Promise<responseDocument> {
    const createdResponse = new this.responseModel(ResponseData);
  let quizId=createdResponse.quiz_id;
   let score=0;
   const quiz=await this.quizModel.findById(quizId).exec();
   let quizQs=quiz.quizQuestions;
   let answers=createdResponse.answers
   for(let i=0;i<answers.length;i++){
   if(answers[i].answer===quiz.quizQuestions[i].correctAnswer)
    score++;
   }
   let scorePrecentage=(score/quiz.quizQuestions.length)*100;
   createdResponse.score=scorePrecentage;
   return createdResponse;
  }

  async findAll(): Promise<responseDocument[]> {
    let responses=await this.responseModel.find();
    return responses;
  }

  async findById(id: string): Promise<responseDocument> {
    return await this.responseModel.findById(id);
  }

  async delete(id: string): Promise<responseDocument> {
   return  await this.responseModel.findByIdAndDelete(id);
  }
  async update(id: string, updateData: UpdateResponseDto): Promise<responseDocument> {
    return await this.responseModel.findByIdAndUpdate(id, updateData, { new: true });  
}

}
