export class CreateChatRoomDTO{
    chatRoomId: string; // MongoDB ObjectID as a string
    participants: string[]; // Array of MongoDB ObjectIDs as strings
    roomType?: string; 
  
}