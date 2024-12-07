import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz,  quizzesSchema } from './models/quizzes.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema:  quizzesSchema }])  // Register Quiz model
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController]
})
export class QuizzesModule {}
