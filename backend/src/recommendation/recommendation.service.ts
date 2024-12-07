import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Recommendation } from './models/recommendation.schema';
import { RecommendationRequestDto } from './dto/create _recommendation_request.dto';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Recommendation.name) private readonly recommendationModel: Model<Recommendation>,
  ) {}

  async getRecommendations(userId: string, numRecommendations?: number): Promise<any> {
    try {
     
      const payload = {
        user_id: userId, 
        num_recommendations: numRecommendations || 2, // Default to 2 if not provided
      };

     
      console.log('Sending request to FastAPI with payload:', payload);

     
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:8000/recommendations/', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      // Log the response for debugging
      console.log('Received response from FastAPI:', response.data);

      // Validate the response structure
      if (!response.data || !response.data.recommended_courses || !Array.isArray(response.data.recommended_courses)) {
        throw new HttpException('Invalid response structure from FastAPI service', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Save the recommendation to the database
      const newRecommendation = new this.recommendationModel({
        recommendation_id: new Date().toISOString(), // Generate a unique ID
        user_id: userId,
        recommended_items: response.data.recommended_courses.map((course: any) => course._id.toString()), // Adjust as needed
        generated_at: new Date(),
      });

      await newRecommendation.save();

      // Return the response data to the client
      return response.data;
    } catch (error) {
     
      console.error('Error fetching or saving recommendations:', error);

      
      if (error.response) {
       
        throw new HttpException(`FastAPI service error: ${error.response.data}`, error.response.status);
      } else if (error.request) {
        
        throw new HttpException('No response received from FastAPI service', HttpStatus.GATEWAY_TIMEOUT);
      } else {
        
        throw new HttpException(`Error in request setup: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
