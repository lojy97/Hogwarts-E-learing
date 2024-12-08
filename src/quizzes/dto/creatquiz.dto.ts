
export class createQuizDTo {
    quiz_id: string;
    module_id: string;
    questions:{
        question:string;
        answer:string;
    }[];
    created_at?: Date;

  }