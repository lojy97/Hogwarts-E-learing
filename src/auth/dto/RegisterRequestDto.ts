import { course } from "src/courses/models/course.schema";


export class RegisterRequestDto {
   
    email:string
    name: string;
    age: Number;
    courses:course[]=[]
    password:string
    role:string= "student"
  }