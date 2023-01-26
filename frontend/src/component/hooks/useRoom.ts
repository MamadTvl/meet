import { useEffect, useRef, useState } from 'react';
import { getToken } from './../../utils/Api';
import { Manager, Socket } from 'socket.io-client';

export interface UseRoom {
    statusLoading: boolean;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
    shouldAskForJoin: boolean;
    joinToRoom: (
        userData: { name: string },
        onResult: (data: { result: boolean }) => void,
    ) => void;
}

interface Args {
    roomId: string;
}

const useRoom = (args: Args): UseRoom => {
    const socket = useRef<Socket | null>(null);
    const { roomId } = args;
    const [roomStarted, setRoomStarted] = useState(false);
    const [shouldAskForJoin, setShouldAskForJoin] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);

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
            } else if (status === 'ask-to-join') {
                setShouldAskForJoin(true);
            }
            setStatusLoading(false);
        });
        return () => {
            const client = socket.current;
            client?.offAny();
            client?.close();
            socket.current = null;
        };
    }, [roomId]);

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

    return {
        statusLoading,
        roomStarted,
        shouldAskForJoin,
        socket,
        joinToRoom,
    };
};

export default useRoom;
