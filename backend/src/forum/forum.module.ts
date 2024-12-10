import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { Forum, ForumSchema } from './models/forum.schema';
import { ThreadModule } from '../threads/threads.module';  // Import ThreadModule for accessing ThreadService
import { Thread, ThreadSchema } from '../threads/models/threads.schema';
import { UserModule } from '../user/user.module';  // Import UserModule for accessing UserService
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forum.name, schema: ForumSchema }, { name: Thread.name, schema: ThreadSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    ThreadModule,  // Import ThreadModule to interact with threads
    UserModule,  // Import UserModule to interact with users
  ],
  providers: [ForumService],
  controllers: [ForumController],
  exports: [ForumService,MongooseModule],  // Export ForumService if it needs to be used in other modules
})
export class ForumModule {}
