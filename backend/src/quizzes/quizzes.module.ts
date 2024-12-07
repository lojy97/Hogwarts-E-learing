import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';  
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz,  quizzesSchema } from './models/quizzes.schema'; 
import { ModuleModule } from '../module/module.module';
import { QuestionsModule } from '../questions/questions.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema:  quizzesSchema }]) ,
    HttpModule, 
    QuestionsModule,
    ModuleModule,
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController]
})
export class QuizzesModule {}
