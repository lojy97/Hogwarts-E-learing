import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from './models/reply.schema';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}
