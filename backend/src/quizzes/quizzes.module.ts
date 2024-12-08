import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';  
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz,  quizzesSchema } from './models/quizzes.schema'; 
import { ModuleModule } from '../module/module.module';
import { QuestionsModule } from '../questions/questions.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema:  quizzesSchema }]) ,
    HttpModule, 
    QuestionsModule,
    ModuleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [MongooseModule]
})
export class QuizzesModule {}
