import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MeetService } from './meet.service';

@WebSocketGateway()
export class MeetGateway {
    constructor(private readonly meetService: MeetService) {}
    // just for testing
    @SubscribeMessage('join-room')
    handleJoin(
        @MessageBody() [roomId, userId, userName],
        @ConnectedSocket() client: Socket,
    ) {
        client.join(roomId);
        client.handshake.headers.userName = userName;
        client.to(roomId).emit('user-connected', userId);
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() message: string,
        @ConnectedSocket() client: Socket,
    ) {
        client
            .to([...client.rooms])
            .emit('createMessage', message, client.handshake.headers.userName);
    }
}
