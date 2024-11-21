
export class CreateUserDto {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    profilePictureUrl?: string;
    createdAt: Date;
}