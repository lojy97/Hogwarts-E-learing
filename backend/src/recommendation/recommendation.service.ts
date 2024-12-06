import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from '../progress/models/progress.schema';
import { Quiz } from '../quizzes/models/quizzes.schema'; // Import Quiz model
import { Response } from '../responses/models/responses.schema'; // Import Response model
import { Module } from '../module/models/module.schema'; // Import Module schema (Assuming you have this model)
import axios from 'axios';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Progress') private readonly progressModel: Model<Progress>,
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>, // Inject Quiz model
    @InjectModel('Response') private readonly responseModel: Model<Response>, // Inject Response model
    @InjectModel('Module') private readonly moduleModel: Model<Module>, // Inject Module model
  ) {}

  async getRecommendationsForUser(userId: string): Promise<any> {
    try {
      // Fetch progress data for the user
      const progressData = await this.progressModel.find({ user_id: userId }).lean();

      // Fetch quiz data for all quizzes (to get module_id)
      const quizData = await this.quizModel.find().lean();

      // Fetch response data for the user (to get the score)
      const responseData = await this.responseModel.find({ user_id: userId }).lean();

      // Fetch module data to link course_id with module_id
      const moduleData = await this.moduleModel.find().lean();

      if (!progressData || progressData.length === 0) {
        throw new Error('No progress data found for the given user_id');
      }

      if (!quizData || quizData.length === 0) {
        throw new Error('No quiz data found');
      }

      if (!responseData || responseData.length === 0) {
        throw new Error('No response data found for the given user_id');
      }

      if (!moduleData || moduleData.length === 0) {
        throw new Error('No module data found');
      }

      // Combine progress data with quiz data (match course_id with module_id) and get score from Response
      const requestData = {
        user_id: userId,
        progress: progressData.map((progress) => {
          // Find the module entry that corresponds to the course_id in moduleData
          const matchingModule = moduleData.find(
            (module) => module._id.toString() === progress.course_id.toString()
          );

          if (!matchingModule) {
            return {
              course_id: progress.course_id,
              completion_percentage: progress.completion_percentage,
              module_id: null,
              score: 0, // No score if no matching module
            };
          }

          // Find the quiz entry that corresponds to module_id
          const matchingQuiz = quizData.find(
            (quiz) => quiz.module_id.toString() === matchingModule._id.toString()
          );

          if (!matchingQuiz) {
            return {
              course_id: progress.course_id,
              completion_percentage: progress.completion_percentage,
              module_id: matchingModule._id,
              score: 0, // No score if no matching quiz
            };
          }

          // Find the response for the quiz using quiz_id (_id in quiz model)
          const matchingResponse = responseData.find(
            (response) => response.quiz_id.toString() === matchingQuiz._id.toString()
          );

          return {
            course_id: progress.course_id,
            completion_percentage: progress.completion_percentage,
            module_id: matchingModule._id, // Use module_id from module
            score: matchingResponse ? matchingResponse.score : 0, // Use score from response, default to 0 if no match
          };
        }),
      };

      // Call the Python recommendation model API
      const recommendationAPI = 'http://127.0.0.1:5000/recommend'; // Ensure this API URL is correct and running
      const response = await axios.post(recommendationAPI, requestData);

      // Return the recommendation results
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Error fetching recommendations: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
