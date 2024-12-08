import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { questions, questionsSchema } from './models/questions.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: questions.name, schema: questionsSchema }]),
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  //exports: [QuestionsService],
  exports: [MongooseModule],
})
export class QuestionsModule {} 
