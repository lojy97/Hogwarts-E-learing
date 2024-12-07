import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { questions, questionsSchema } from './models/questions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: questions.name, schema: questionsSchema }]),
    HttpModule,
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  //exports: [QuestionsService],
  exports: [MongooseModule],
})
export class QuestionsModule {} 
