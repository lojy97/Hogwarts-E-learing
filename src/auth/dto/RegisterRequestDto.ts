import { Course } from 'src/course/models/course.schema';
import { UserRole } from 'src/user/models/user.schema';

export class RegisterRequestDto {
  email: string;
  name: string;
  age: number;
  courses: Course[] = [];
  password: string;
  role: UserRole = UserRole.Student;
}