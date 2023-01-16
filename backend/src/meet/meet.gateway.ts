import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Roles } from 'src/roles/entities/role.entity';
import { MeetService } from './meet.service';
import {
    MeetServer,
    MeetSocket,
    JoinRoomData,
    MeetRemoteSocket,
} from './types';

@WebSocketGateway()
export class MeetGateway
    implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger(MeetGateway.name);

    constructor(private readonly meetService: MeetService) {}

    async handleConnection(client: MeetSocket) {
        const token = client.handshake.headers.authorization || '';
        const roomId = client.handshake.query.roomId as string;
        if (!roomId) {
            client.disconnect();
        }
        client.data = await this.meetService.userData(token, roomId);
        if (this.server.of('/').adapter.rooms.has(roomId)) {
            this.meetService.joinUserToRoom(client, roomId);
            return;
        }
        const hasPermission =
            client.data?.memberships[0]?.role.name === Roles.ADMIN;
        if (!hasPermission) {
            client.disconnect();
        }
        client.join(roomId);
    }

    private async getRoomAdmin(
        roomId: string,
    ): Promise<MeetRemoteSocket | null> {
        const sockets: MeetRemoteSocket[] = await this.server
            .in(roomId)
            .fetchSockets();

        const adminSocket = sockets.find(
            (socket) => socket.data?.memberships[0]?.role.name === Roles.ADMIN,
        );
        return adminSocket;
    }
    //TODO: handle joining with notification

    //todo: validate data
    @SubscribeMessage('join-room')
    public async joinRoom(
        @ConnectedSocket() client: MeetSocket,
        @MessageBody() data: JoinRoomData,
    ) {
        const adminSocket = await this.getRoomAdmin(data.roomId);
        adminSocket.emit('new-request', {
            //FIXME: maybe our guest is authorized
            guest: data.guest,
            socketId: client.id,
        });
        client.data = data.guest;
    }

    @SubscribeMessage('accept-joining')
    public async acceptJoining(client: MeetSocket, data: { socketId: string }) {
        const guest = await this.server.in(data.socketId).fetchSockets();
        guest[0].join(client.handshake.query.roomId);
        client.to(data.socketId).emit('join-result', { result: true });
    }

    @SubscribeMessage('reject-joining')
    public rejectJoining(client: MeetSocket, data: any): void {
        client.to(data.socketId).emit('join-result', { result: false });
        this.server.in(data.socketId).disconnectSockets();
    }

    @SubscribeMessage('call-user')
    public callUser(client: MeetSocket, data: any): void {
        client.to(data.to).emit('call-made', {
            offer: data.offer,
            socket: client.id,
        });
    }

    @SubscribeMessage('make-answer')
    public makeAnswer(client: MeetSocket, data: any): void {
        client.to(data.to).emit('answer-made', {
            answer: data.answer,
            socket: client.id,
        });
    }

    @SubscribeMessage('send-message')
    public sendMessage(client: MeetSocket, data: { message: string }) {
        if (client.data) {
            client.broadcast
                .to(client.handshake.query.roomId)
                .emit('new-message', {
                    from: client.data,
                    message: data.message,
                    date: new Date(),
                });
        }
    }

    public afterInit(server: MeetServer): void {
        this.logger.log('Init Meet Gateway');
    }

    public handleDisconnect(client: MeetSocket): void {
        //TODO: broadcast that this client left the meeting
    }
}
