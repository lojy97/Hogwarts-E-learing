export class CreateUserInteractionDto {
    interaction_id: string;
    user_id: string;
    course_id: string;
    score: number;
    time_spent_minutes: number;
    readonly last_accessed: Date;
  }
  