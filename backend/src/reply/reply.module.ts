import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply, ReplySchema } from './models/reply.schema';
import { Thread, ThreadSchema } from '../threads/models/threads.schema';
import { ForumModule } from '../forum/forum.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema }, // Register Reply schema
      { name: Thread.name, schema: ThreadSchema },
      { name: User.name, schema: UserSchema }

    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    ForumModule,
    UserModule

  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule { }
