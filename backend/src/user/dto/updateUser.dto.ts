import { UserRole } from '../models/user.schema';

export class UpdateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    profilePictureUrl?: string;
    courses: string[]; // Assuming courses are represented by their IDs
}