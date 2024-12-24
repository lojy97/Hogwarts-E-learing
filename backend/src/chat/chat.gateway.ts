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

  // Triggered when the gateway is initialized
  afterInit(server: Server) {
    console.log('Initialized Gateway');
  }

  // Triggered when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Triggered when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('-----------------joined', data.userId);
    client.join(data.userId);
    // this.server.emit('online', { userId: data.userId });
    return { user: {userId: data.userId} };
  }
}
