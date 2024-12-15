import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { HttpModule } from '@nestjs/axios';
import { ProgressController } from './progress.controller';
import { ModuleModule } from '../module/module.module';
import { CourseModule } from 'src/course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress,progressDocument, ProgressSchema } from './models/progress.schema';
import { UserModule } from 'src/user/user.module';  // Import UserModule
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [ProgressService],
  controllers: [ProgressController],
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema:  ProgressSchema }]) ,
    HttpModule, 
    CourseModule,
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
  exports: [MongooseModule]
})
export class ProgressModule {}
