export class UpdateProgressDto {
    progress_id?: string;
    user_id?: string;
    course_id?: string;
    completion_percentage?: number;
    last_accessed?: Date;
    performanceMetric?: 'Beginner' | 'Intermediate' | 'Advanced';
  }
  