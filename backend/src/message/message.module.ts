// backend/src/message/message.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from './models/message.schema';
import { ChatModule } from '../chat/chat.module'; // Import ChatModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => ChatModule), // Use forwardRef to handle circular dependency
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService], // Export MessageService if you need it in other modules
})
export class MessageModule {}