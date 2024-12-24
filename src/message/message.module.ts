import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './models/message.schema';  

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService]  // Export MessageService if you need it in other modules
})
export class MessageModule {}
