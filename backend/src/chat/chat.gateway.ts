import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat.service';
import { MessageService } from '../message/message.service';
import { webuser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.schema'; 

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { chatRoomId: string; content: string },
    @webuser() user: User,  // Using the User interface
  ) {
    const message = await this.messageService.createMessage(data.chatRoomId, user.id, data.content);
    this.server.to(data.chatRoomId).emit('receiveMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { chatRoomId: string },
    @ConnectedSocket() client: Socket,  // Accessing the client socket
  ) {
    client.join(data.chatRoomId);
    return { event: 'joinedRoom', chatRoomId: data.chatRoomId };
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody() data: { messageId: string; isRead?: boolean; content?: string },
    @webuser() user: User,  // Using the User interface
  ) {
    const updatedMessage = await this.messageService.updateMessage(data.messageId, data.isRead, data.content);
    this.server.emit('messageUpdated', updatedMessage);
    return updatedMessage;
  }
}