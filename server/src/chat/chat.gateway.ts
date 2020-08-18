import {
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Logger, UseGuards} from "@nestjs/common";
import {Server, Socket} from "socket.io";

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit ,OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway')

  @WebSocketServer()
  server: Server

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, message: string, room: string}): void {
    this.server.to(message.room).emit('chatToClient', message)
    console.log('message', message)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client :Socket, room: string) {
    client.join(room)
    client.emit('joinedRoom', room)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client :Socket, room: string) {
    client.leave(room)
    client.emit('leftRoom', room)
  }

  afterInit(server: Server): any {
    this.logger.log(`Socket.io server started`)
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected ${client.id}`)
  }
}
