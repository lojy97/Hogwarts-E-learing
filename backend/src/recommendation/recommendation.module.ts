import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Progress, ProgressSchema } from '../progress/models/progress.schema';
import { Quiz, quizzesSchema } from '../quizzes/models/quizzes.schema';
import { Response, ResponseSchema } from '../responses/models/responses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Quiz', schema: quizzesSchema },
      { name: 'Response', schema: ResponseSchema }, // Add Response model
    ]),
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
