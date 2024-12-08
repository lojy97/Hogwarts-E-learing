import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply, ReplySchema } from './models/reply.schema';
import { Thread, ThreadSchema } from '../threads/models/threads.schema';
import { ForumModule } from '../forum/forum.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema }, // Register Reply schema
      { name: Thread.name, schema: ThreadSchema },
      
    ]),
    ForumModule
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
