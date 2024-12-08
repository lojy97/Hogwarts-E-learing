import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';  
import { ResponsesController } from './responses.controller';
import { Response,  ResponseSchema } from './models/responses.schema'; 
import { QuizzesModule } from '../quizzes/quizzes.module';
import { ModuleModule } from '../module/module.module';
import { ProgressModule } from 'src/progress/progress.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Response.name, schema:  ResponseSchema }]) ,
    HttpModule, 
    QuizzesModule,
    ModuleModule,
        ProgressModule,
        CourseModule
 
  ], exports: [MongooseModule],
  
  providers: [ResponsesService],
  controllers: [ResponsesController]

})
export class ResponsesModule {}
