export class CreateRecommendationDto {
    readonly recommendation_id: string;
    readonly user_id: string;
    readonly recommended_items: string[];
    readonly generated_at: Date;
  }
  