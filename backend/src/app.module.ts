import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { InteractionsModule } from './interactions/interactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
<<<<<<< HEAD:src/app.module.ts

 imports: [
  ConfigModule.forRoot({ isGlobal: true }), // To Load .env globally
  MongooseModule.forRoot(process.env.DB_URL || 'mongodb://localhost:27017/witches'
    
  ),


  CourseModule,
  QuizzesModule,
  ResponsesModule,
  ProgressModule,
  UserModule,
  ModuleModule,
  InteractionsModule,
  AuthModule,
],
controllers: [AppController],
providers: [AppService],
=======
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    MongooseModule.forRoot(process.env.DB_URL), // Use DB_URL from .env
    CourseModule,
    QuizzesModule,
    ResponsesModule,
    ProgressModule,
    UserModule,
    ModuleModule,
    InteractionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
>>>>>>> master:backend/src/app.module.ts
})
export class AppModule {}