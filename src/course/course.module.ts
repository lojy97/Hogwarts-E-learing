import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseSchema } from './models/course.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), 
  ],
  providers: [CourseService],  
  controllers: [CourseController],  
  exports: [CourseService],  
})
export class CourseModule {}