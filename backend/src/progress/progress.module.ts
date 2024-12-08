import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { HttpModule } from '@nestjs/axios';
import { ProgressController } from './progress.controller';
import { ModuleModule } from '../module/module.module';
import { CourseModule } from 'src/course/course.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress,progressDocument, ProgressSchema } from './models/progress.schema';

@Module({
  providers: [ProgressService],
  controllers: [ProgressController],
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema:  ProgressSchema }]) ,
    HttpModule, 
    CourseModule,
    ModuleModule,
  ],
  exports: [MongooseModule]
})
export class ProgressModule {}
