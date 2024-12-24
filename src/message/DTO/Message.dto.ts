export class MessageDto {
    messageId: string; // MongoDB ObjectID as a string
    chatRoomId: string; // MongoDB ObjectID as a string
    sender: string; // MongoDB ObjectID as a string
    content: string; 
    isRead?: boolean; 
  }