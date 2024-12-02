export class UpdateResponseDto {
    
    user_id?: string;
 
    quiz_id?: string;

    answers?: {
      question_id: string;
      answer: string;
    }[];
  
 
    score?: number;
  }