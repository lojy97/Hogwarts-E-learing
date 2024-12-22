import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Course } from 'src/course/models/course.schema';
import { UserRole } from 'src/user/models/user.schema';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  profilePictureUrl?: string;
  courses?: Course[] = [];

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  role: UserRole;
}