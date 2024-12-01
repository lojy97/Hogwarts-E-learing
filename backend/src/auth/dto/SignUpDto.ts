import { Course } from 'src/course/models/course.schema';
import { UserRole } from 'src/user/models/user.schema';

export class SignUpDto {
  email: string;
  name: string;
  profilePictureUrl?: string;
  courses: Course[] = [];
  password: string;
  role: UserRole;
}