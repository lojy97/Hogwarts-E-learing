import { Controller, Get, Post, Body, Param, Delete,Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/creatresponse.dto';
import { UpdateResponseDto } from './dto/updateresponse.dto';
import { ModulesContainer } from '@nestjs/core';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/models/user.schema';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { NotFoundException } from '@nestjs/common';
import { ResponseSchema,responseDocument } from './models/responses.schema';
import mongoose from 'mongoose';


  
@Controller('responses')
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}
   @Post()

    async create(@Body() responseData: CreateResponseDto) :Promise<responseDocument> {{
    const newRes=await this.responsesService.create(responseData);
    return newRes;
    }
  
}

@Get('quiz')
 async findByUserAndQuiz(
   @Query('quizId') quizId:  mongoose.Types.ObjectId,
 ): Promise<responseDocument > {
if ( !quizId) {
     return null; // Return null if either parameter is missing
   }

return await this.responsesService.findByQuizId( quizId);
 }

@Get(':id')
async getCourseById(@Param('id') id: string):Promise<responseDocument>{
    const quiz = await this.responsesService.findById(id);
    return quiz;
}

@Post()
async createCourse(@Body()quizData: CreateResponseDto):Promise<responseDocument> {
    const newQuiz = await this.responsesService.create(quizData);
    return newQuiz;
}


@Delete(':id')
async deleteStudent(@Param('id')id:string):Promise<responseDocument> {
    const deletedQuiz = await this.responsesService.delete(id);
   return deletedQuiz;
}



}
