import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Add this import for HttpService to be available
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommendation, RecommendationSchema } from './models/recommendation.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recommendation.name, schema: RecommendationSchema }]),
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }), // Add HttpModule here to use HttpService in the service
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
