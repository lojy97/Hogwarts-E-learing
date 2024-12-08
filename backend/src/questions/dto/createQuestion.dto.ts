import mongoose from "mongoose";

export class createQuestionDto{
    tf: {id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];
    mcq: {id:mongoose.Types.ObjectId;question:string;correctAnswer:string}[];

  }