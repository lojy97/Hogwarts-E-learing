import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { CreateUserInteractionDto } from '../interactions/dto/create-user-interaction.dto';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

 
  @Post('interaction')
  async addUserInteraction(@Body() createUserInteractionDto: CreateUserInteractionDto) {
    return this.recommendationService.addUserInteraction(createUserInteractionDto);
  }

  // Getting recommendations for user
  @Get(':userId')
  async getRecommendations(@Param('userId') userId: string) {
    const recommendations = await this.recommendationService.getRecommendations(userId);
    if (!recommendations.length) {
      const generatedRecommendation = await this.recommendationService.generateRecommendations(userId);
      return { message: 'Generated recommendations', recommended_items: generatedRecommendation.recommended_items };
    }
    return recommendations;
  }
}
