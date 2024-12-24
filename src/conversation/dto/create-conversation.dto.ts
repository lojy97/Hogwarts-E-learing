export class CreateConversationDto {
    chatRoomId: string; 
    participants: string[]; 
  }
  
  export class AddMessageToConversationDto {
    conversationId: string; 
    messageId: string; 
  }
  
  export class ConversationDto {
    conversationId: string; 
    chatRoomId: string; 
    participants: string[]; 
    messages: string[]; 
  }
  