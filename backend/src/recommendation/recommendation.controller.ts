import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationRequestDto } from './dto/create _recommendation_request.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { RolesGuard } from 'src/auth/guards/authorization.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.schema';

@UseGuards(AuthGuard, RolesGuard) // Protect the route
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  //@Post('/')
  //async getRecommendations(@Body() request: RecommendationRequestDto, @CurrentUser() user : User& { userId: string }) {
    //console.log('User from CurrentUser Decorator:', User); // Log the user object to confirm it has the `userId`
    
    // Ensure that the user object contains the userId
   // if (!user || !user.userId) {
     // throw new BadRequestException('userId is required');
   // }
  
    // Extract the userId from the user object (from the CurrentUser decorator)
   // const { userId } = user;
    
    // Proceed with the request payload
   // const { num_recommendations } = request; 
   // return this.recommendationService.getRecommendations(userId, num_recommendations);
 // }
 @Post('/')
  async getRecommendations(@Body() request: RecommendationRequestDto) {
    // Extract the userId and num_recommendations from the request body
    const { user_id, num_recommendations } = request;

    // Validate the presence of userId
    if (!user_id) {
      throw new BadRequestException('userId is required');
    }

    // Call the recommendation service with the provided userId and num_recommendations
    return this.recommendationService.getRecommendations(user_id, num_recommendations);
  }
}


