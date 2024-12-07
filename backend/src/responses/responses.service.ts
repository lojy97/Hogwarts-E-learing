import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from './models/responses.schema';
import { CreateResponseDto } from './dto/creatresponse.dto';
import { UpdateResponseDto } from './dto/updateresponse.dto';
import { Quiz } from '../quizzes/models/quizzes.schema';

@Injectable()
export class ResponsesService {
  /*
  constructor(@InjectModel(Response.name) private responseModel: Model<Response>) {}

  async create(userId: string, quizId: string, answers: { questionId: string; answer: string }[]): Promise<Response> {
    const createdResponse = new this.responseModel(createResponseDto);
   let score=0;
   const quiz=await this.quizModel.findById(quizId).exec();
  }

  async findAll(): Promise<Response[]> {
    let responses=await this.responseModel.find();
    return responses;
  }

  async findOne(id: string): Promise<Response> {
    return await this.responseModel.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.responseModel.findByIdAndDelete(id);
  }
  async update(id: string, updateData: UpdateResponseDto): Promise<Response> {
    return await this.responseModel.findByIdAndUpdate(id, updateData, { new: true });  
}
*/
}
