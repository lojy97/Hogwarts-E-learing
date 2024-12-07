export class UpdateQuizDto {
  questionsITF?:[number];
  questionsIMCQ?:[number];
  created_at?: Date;
  quizQuestions?: { question: string; correctAnswer: string }[];

  }