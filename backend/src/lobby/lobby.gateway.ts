import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001)
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`New user joined! Id: ${client.id}`);
    client.broadcast.emit('Connections', `Welcome ${client.id}!`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User ${client.id} disconnected! ;(`);
    this.server.emit('Connections', `${client.id} hit the sack!`);
  }

  @SubscribeMessage('player:join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    console.log(`User: ${client.id} joined Room: ${roomId}`);
    this.server
      .to(roomId)
      .emit('lobby:update', `${client.id} joined the room!`);
  }
}
