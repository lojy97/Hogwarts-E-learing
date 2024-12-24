
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;
  
  constructor() {
  
    this.socket = io('http://localhost:3000');
  }

  joinRoom(chatRoomId: string) {
    this.socket.emit('joinRoom', { chatRoomId });
  }

  sendMessage(chatRoomId: string, sender: string, content: string) {
    this.socket.emit('sendMessage', { chatRoomId, sender, content });
  }

  updateMessage(messageId: string, isRead?: boolean, content?: string) {
    this.socket.emit('updateMessage', { messageId, isRead, content });
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket.on('receiveMessage', callback);
  }

  onMessageUpdated(callback: (message: any) => void) {
    this.socket.on('messageUpdated', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService();
