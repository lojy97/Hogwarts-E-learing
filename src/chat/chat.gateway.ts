import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatRoomService } from './chat.service';
import { MessageService } from '../message/message.service';
import {  ChatModule } from '../chat/chat.module';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: { chatRoomId: string; sender: string; content: string }) {
    const message = await this.messageService.createMessage(data.chatRoomId, data.sender, data.content);
    this.server.to(data.chatRoomId).emit('receiveMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { chatRoomId: string }) {
    this.server.socketsJoin(data.chatRoomId);
    return { event: 'joinedRoom', chatRoomId: data.chatRoomId };
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(@MessageBody() data: { messageId: string; isRead?: boolean; content?: string }) {
    const updatedMessage = await this.messageService.updateMessage(data.messageId, data.isRead, data.content);
    this.server.emit('messageUpdated', updatedMessage);
    return updatedMessage;
  }
}
