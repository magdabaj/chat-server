import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from "socket.io";

@WebSocketGateway({ namespace: '/alert'})
export class AlertGateway {
  @WebSocketServer()
  server: Server

  sendToAll(message: string) {
    this.server.emit('alertToClient', { type: "Alert", message})
  }
}
