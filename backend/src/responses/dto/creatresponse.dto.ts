export class CreateResponseDto {
   
    response_id: string;
  
   
    user_id: string;
  
   
    quiz_id: string;
  
   
    answers: {
      questionId: string;
      answer: string;
    }[];
  
   
    score: number;
  }