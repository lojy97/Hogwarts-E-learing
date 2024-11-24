import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string; // Unique module identifier

  @IsString()
  @IsNotEmpty()
  courseId: string; // Associated course ID

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  resources?: string[]; // Optional array of resource URLs
}
