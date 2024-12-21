import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
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
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ForumModule } from './forum/forum.module';
import { ThreadModule } from './threads/threads.module';
import { ReplyModule } from './reply/reply.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { QuestionsModule } from './questions/questions.module';
import { EmailModule } from './email/email.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
    HttpModule,
    AuthModule, 
    CourseModule,
    QuizzesModule,
    ResponsesModule,
    ProgressModule,
    UserModule,
    ModuleModule,
    RecommendationModule,
    InteractionsModule,
    AuthModule,
    ChatModule,
    MessageModule,
    ForumModule,
    ThreadModule,
    ReplyModule,
    QuestionsModule,
    EmailModule,
    NotificationsModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
