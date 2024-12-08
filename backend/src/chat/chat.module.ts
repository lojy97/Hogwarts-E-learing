// backend/src/chat/chat.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomService } from './chat.service';
import { ChatRoomController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRoom, ChatRoomSchema } from './models/chat-room.schema';
import { Message, MessageSchema } from '../message/models/message.schema';
import { MessageModule } from '../message/message.module'; // Import MessageModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    forwardRef(() => MessageModule), // Use forwardRef to handle circular dependency
  ],
  providers: [ChatRoomService, ChatGateway],
  controllers: [ChatRoomController],
  exports: [ChatRoomService, MongooseModule], // Export ChatRoomService and MongooseModule
})
export class ChatModule {}