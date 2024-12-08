import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadService } from './threads.service';
import { ThreadController } from './threads.controller';
import { Thread, ThreadSchema } from './models/threads.schema';
import { Forum, ForumSchema } from '../forum/models/forum.schema';
import { ReplyModule } from '../reply/reply.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Forum.name, schema: ForumSchema }, // Import Forum schema to update forums
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}