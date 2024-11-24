export class CreateCourseDTO {
  courseId: string; 
  title: string; 
  description: string; 
  category: string; 
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  createdBy: string; 
  createdAt: Date; 
}
