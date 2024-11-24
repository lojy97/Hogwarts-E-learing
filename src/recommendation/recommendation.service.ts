import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInteraction } from './models/user-interaction.schema';
import { Recommendation } from './models/recommendation.schema';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';


@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(UserInteraction.name) private userInteractionModel: Model<UserInteraction>,
    @InjectModel(Recommendation.name) private recommendationModel: Model<Recommendation>,
  ) {}


  async addUserInteraction(data: CreateUserInteractionDto): Promise<UserInteraction> {
    const newInteraction = new this.userInteractionModel(data);
    return newInteraction.save();
  }

  // Getting the user interactions by the user ID 
  async getUserInteractions(userId: string): Promise<UserInteraction[]> {
    return this.userInteractionModel.find({ user_id: userId }).exec();
  }

  // Generate recommendations based on user interactions
  async generateRecommendations(userId: string): Promise<Recommendation> {
    const interactions = await this.getUserInteractions(userId);

    if (!interactions.length) {
      throw new Error('No interactions found for this user.');
    }


    const recommendedCourses = interactions
      .filter((interaction) => interaction.score >= 80)  
      .map((interaction) => interaction.course_id);

   
    const recommendation = new this.recommendationModel({
      recommendation_id: `rec_${userId}_${Date.now()}`,
      user_id: userId,
      recommended_items: recommendedCourses,
      generated_at: new Date(),
    });

    return recommendation.save();
  }


  async getRecommendations(userId: string): Promise<Recommendation[]> {
    return this.recommendationModel.find({ user_id: userId }).exec();
  }
}
