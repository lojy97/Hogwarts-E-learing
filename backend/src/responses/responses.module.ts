import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';  
import { ResponsesController } from './responses.controller';
import { Response,  ResponseSchema } from './models/responses.schema'; 
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Response.name, schema:  ResponseSchema }]) ,
    HttpModule, 
    QuizzesModule,
 
  ],
  
  providers: [ResponsesService],
  controllers: [ResponsesController]

})
export class ResponsesModule {}
