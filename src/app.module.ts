import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationModule } from './recommendation/recommendation.module';


@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/e-learning"),
    CourseModule, QuizzesModule, ResponsesModule, ProgressModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
