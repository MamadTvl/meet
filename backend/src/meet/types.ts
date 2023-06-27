import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { User } from 'src/users/entities/user.entity';
import { RemoteSocket, Server, Socket } from 'socket.io';

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

export interface JoinRoomData {
    roomId: string;
    guest?: {
        name: string;
    };
}

type SocketUser = User & { muted?: boolean; videoOff?: boolean };

export type MeetSocket = Socket<
    DefaultEventsMap,
    any,
    DefaultEventsMap,
    SocketUser
>;
export type MeetRemoteSocket = RemoteSocket<DefaultEventsMap, SocketUser>;
export type MeetServer = Server<
    DefaultEventsMap,
    any,
    DefaultEventsMap,
    SocketUser
>;
