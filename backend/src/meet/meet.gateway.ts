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

@WebSocketGateway({ cors: '*' })
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
            if (client.data?.memberships[0]?.room.id === roomId) {
                this.handleJoining(client, roomId);
                return;
            }
            client.emit('connection-status', {
                status: 'ask-to-join',
            });
            return;
        }
        const hasPermission =
            client.data?.memberships[0]?.role?.name === Roles.ADMIN;
        if (!hasPermission) {
            client.disconnect();
            return;
        }
        this.handleJoining(client, roomId);
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

    private async handleJoining(client: MeetSocket, roomId: string) {
        client.join(roomId);
        client.emit('connection-status', {
            status: 'joined',
        });
    }

    @SubscribeMessage('get-room')
    public async getRoom(@ConnectedSocket() client: MeetSocket) {
        const roomId = client.handshake.query.roomId as string;
        if (client.rooms.has(roomId)) {
            const sockets = await this.server.sockets.in(roomId).fetchSockets();
            const socketIds = sockets
                .map((socket) => ({
                    id: socket.id,
                    name: `${socket.data.firstName || ''} ${
                        socket.data.lastName || ''
                    }`,
                }))
                .filter((socket) => socket.id !== client.id);
            client.emit('room-users', socketIds);
        }
    }

    @SubscribeMessage('ready-to-connect')
    public async notify(@ConnectedSocket() client: MeetSocket) {
        const roomId = client.handshake.query.roomId as string;
        if (client.rooms.has(roomId)) {
            const name = `${client.data.firstName || ''} ${
                client.data.lastName || ''
            }`;
            client.broadcast
                .to(roomId)
                .emit('user-connected', { id: client.id, name });
        }
    }

    //todo: validate data
    @SubscribeMessage('join-room')
    public async joinRoom(
        @ConnectedSocket() client: MeetSocket,
        @MessageBody() data: JoinRoomData,
    ) {
        const adminSocket = await this.getRoomAdmin(data.roomId);
        adminSocket.emit('new-request', {
            name: client.data
                ? `${client.data.firstName || ''} ${client.data.lastName || ''}`
                : data.guest.name,
            socketId: client.id,
        });
        client.data = { firstName: data.guest.name };
    }
    //todo: add role guard

    @SubscribeMessage('joining-decision')
    public async joiningDecision(
        client: MeetSocket,
        data: { socketId: string; decision: boolean },
    ) {
        const guest = this.server.sockets.sockets.get(data.socketId);
        if (data.decision) {
            this.handleJoining(guest, client.handshake.query.roomId as string);
            client.to(data.socketId).emit('join-result', { result: true });
        } else {
            client.to(data.socketId).emit('join-result', { result: false });
        }
    }

    @SubscribeMessage('call-user')
    public callUser(client: MeetSocket, data: any): void {
        console.log(data.socketId);
        this.server.to(data.socketId).emit('call-made', {
            offer: data.offer,
            socketId: client.id,
        });
    }

    @SubscribeMessage('make-answer')
    public makeAnswer(client: MeetSocket, data: any): void {
        this.server.to(data.socketId).emit('answer-made', {
            answer: data.answer,
            socketId: client.id,
        });
    }

    @SubscribeMessage('make-candidate')
    public makeCandidate(client: MeetSocket, data: any): void {
        this.server.to(data.socketId).emit('candidate-made', {
            candidate: data.candidate,
            socketId: client.id,
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
        const roomId = client.handshake.query.roomId as string;
        this.server
            .to(client.handshake.query.roomId)
            .emit('user-disconnected', client.id);
    }
}
