import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply, ReplySchema } from './models/reply.schema';
import { Thread, ThreadSchema } from '../threads/models/threads.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema }, // Register Reply schema
      { name: Thread.name, schema: ThreadSchema }, // Register Thread schema for updates
    ]),
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
