
export class UpdateUserDto {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    profilePictureUrl?: string;
    createdAt: Date;
}