import { UserRole } from '../models/user.schema';
import { Course } from 'src/course/models/course.schema';


export class CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    profilePictureUrl?: string;
    courses: Course[] = [];
    emailVerified: boolean;
}