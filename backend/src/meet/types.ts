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
        firstName: string;
        lastName: string;
    };
}

export type MeetSocket = Socket<DefaultEventsMap, any, DefaultEventsMap, User>;
export type MeetRemoteSocket = RemoteSocket<DefaultEventsMap, User>;
export type MeetServer = Server<DefaultEventsMap, any, DefaultEventsMap, User>;
