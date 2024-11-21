import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ CourseModule, QuizzesModule, ResponsesModule, ProgressModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
