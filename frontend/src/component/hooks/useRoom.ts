import { useEffect, useRef, useState } from 'react';
import { getToken } from './../../utils/Api';
import { Manager, Socket } from 'socket.io-client';

interface UseRoom {
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
    shouldAskForJoin: boolean;
    joinToRoom: (
        userData: { firstName: string; lastName: string },
        onResult: (data: { result: boolean }) => void,
    ) => void;
    handleNewJoinRequest: (socketId: string, decision: boolean) => void;
}

interface Args {
    roomId: string;
    onNewJoinRequest: (data) => void;
}

const useRoom = (args: Args): UseRoom => {
    const socket = useRef<Socket | null>(null);
    const { roomId, onNewJoinRequest } = args;
    const [roomStarted, setRoomStarted] = useState(false);
    const [shouldAskForJoin, setShouldAskForJoin] = useState(false);

    useEffect(() => {
        
        console.log(socket.current);
        if (socket.current) {
            return;
        }
        const manager = new Manager(import.meta.env.VITE_SOCKET_URL, {
            query: { roomId },
            extraHeaders: {
                authorization: getToken(),
            },
            autoConnect: true,
        });
        socket.current = manager.socket('/');
        socket.current.on('connection-status', ({ status }) => {
            console.log('status', status);

            if (status === 'joined') {
                setRoomStarted(true);
            } else if (status === 'ask') {
                setShouldAskForJoin(true);
            }
        });
        socket.current.on('new-request', onNewJoinRequest);
        return () => {
            const client = socket.current;
            client?.offAny();
            client?.close();
            socket.current = null;
        };
    }, [onNewJoinRequest, roomId]);

    const joinToRoom: UseRoom['joinToRoom'] = (userData, onResult) => {
        socket.current?.once('join-result', (data) => {
            if (data.result) {
                setRoomStarted(true);
            }
            onResult(data);
        });
        socket.current?.emit('join-room', {
            guest: userData,
            roomId,
        });
    };

    const handleNewJoinRequest = (socketId: string, decision: boolean) => {
        socket.current?.emit('joining-decision', { socketId, decision });
    };

    return {
        roomStarted,
        shouldAskForJoin,
        socket,
        joinToRoom,
        handleNewJoinRequest,
    };
};

export default useRoom;
