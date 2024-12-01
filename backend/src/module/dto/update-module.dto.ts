export class UpdateModuleDTO {
    moduleId?: string; 
    courseId?: string; 
    title?: string; 
    content?: string;
    resources?: string[]; 
    createdAt?: Date; 
  }