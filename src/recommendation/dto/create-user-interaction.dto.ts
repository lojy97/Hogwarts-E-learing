export class CreateUserInteractionDto {
    readonly interaction_id: string;
    readonly user_id: string;
    readonly course_id: string;
    readonly score: number;
    readonly time_spent_minutes: number;
    readonly last_accessed: Date;
  }
  