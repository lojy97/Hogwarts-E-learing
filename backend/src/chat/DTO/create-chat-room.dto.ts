export class CreateChatRoomDTO{
    title: string;
    participants: string[]; // Array of MongoDB ObjectIDs as strings
    roomType?: string; 
    course: string; // MongoDB ObjectID as string
  
}