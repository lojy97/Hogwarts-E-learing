import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommendationService {
  constructor(private readonly httpService: HttpService) {}

  async getRecommendations(userId: string, numRecommendations?: number): Promise<any> {
    try {
      const payload = {
        user_id: userId,  // Pass the userId directly from the CurrentUser decorator
        num_recommendations: numRecommendations || 2, // Default to 2 if not provided
      };

      console.log('Sending request to FastAPI with payload:', payload);

      // Send request to FastAPI recommendation service
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:8000/recommendations/', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      console.log('Received response from FastAPI:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Error fetching recommendations');
    }
  }
}
