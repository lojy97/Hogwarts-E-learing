import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async getRecommendations(@Body('user_id') userId: string): Promise<any> {
    try {
      // Validate that the user_id is provided
      if (!userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      // Call the service to fetch recommendations for the user
      const recommendations = await this.recommendationService.getRecommendationsForUser(userId);

      return recommendations; // Return the recommendations received from the service
    } catch (error) {
      throw new HttpException(
        `Error fetching recommendations: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
