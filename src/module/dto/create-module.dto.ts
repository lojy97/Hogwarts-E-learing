export class CreateModuleDTO {
  moduleId: string; 
  courseId: string; 
  title: string; 
  content: string; 
  resources?: string[];
  createdAt: Date; 
}