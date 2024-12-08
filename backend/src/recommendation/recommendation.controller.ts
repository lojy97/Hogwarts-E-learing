import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationRequestDto } from './dto/create _recommendation_request.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('/')
  async getRecommendations(@Body() request: RecommendationRequestDto) {
    
    if (!request.user_id) {
      throw new BadRequestException('userId is required');
    }

    const { user_id, num_recommendations} = request; 
    return this.recommendationService.getRecommendations(user_id, num_recommendations);
  }
}
