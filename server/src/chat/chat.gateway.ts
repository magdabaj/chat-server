import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import {Logger} from "@nestjs/common";
import {Server, Socket} from "socket.io";
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit ,OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway')

  @WebSocketServer()
  server: Server

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload)
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
