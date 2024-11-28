import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleModule } from './module/module.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
 imports: [
  MongooseModule.forRoot('mongodb://localhost:27017/witchesDB'),
  CourseModule, QuizzesModule, ResponsesModule, ProgressModule, UserModule, ModuleModule, InteractionsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
