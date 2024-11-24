import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string; // Unique course identifier

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string; // Course category

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'], { message: 'Difficulty level must be Beginner, Intermediate, or Advanced' })
  difficultyLevel: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string; // Instructor ID
}
