
export class UpdateUserDto {
    name: string;
    passwordHash: string;
    profilePictureUrl?: string;
    courses: string[]; // Assuming courses are represented by their IDs
}