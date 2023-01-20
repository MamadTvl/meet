import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createPeers, Peer } from '../../utils/Peer';
import useOneCall from './useOneCall';
export interface UseWebRTC {
    users: string[];
    peers: {
        [id: string]: Peer;
    };
}

interface Args {
    roomId: string;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
    localStream: MediaStream | null;
}

const useWebRTC = (args: Args): UseWebRTC => {
    const { socket, roomStarted, localStream } = args;
    const getInitialRooms = useRef(false);
    const [users, setUsers] = useState<string[]>([]);
    const peersInstance = useMemo(() => createPeers(), []);
    // const peers = useRef<{ [id: string]: Peer }>({});

    const start = useCallback(() => {
        const client = socket.current;
        if (!client) {
            return;
        }
        console.log('start');

        client.once('room-users', async (socketIds: string[]) => {
            const initialUsers: string[] = [];
            for (const socketId of socketIds) {
                const peer = new Peer(socketId);
                peer.init(localStream);
                initialUsers.push(socketId);
                peersInstance.add(socketId, peer);
            }
            setUsers(initialUsers);
            client.emit('ready-to-connect');
            getInitialRooms.current = true;
        });
        client.on('user-connected', async (socketId: string) => {
            if (peersInstance.peers[socketId]) {
                return;
            }
            const peer = new Peer(socketId);
            peer.init(localStream);
            const offer = await peer.createOffer();
            peersInstance.add(socketId, peer);
            setUsers((prvState) => [...prvState, socketId]);
            client.emit('call-user', { offer, socketId });
        });
        client.on('user-disconnected', (socketId: string) => {
            const peer = peersInstance.peers[socketId];
            if (!peer) {
                return;
            }
            peer.clearConnection();
            peersInstance.remove(socketId);
            setUsers((prvState) => prvState.filter((id) => id !== socketId));
        });
        client.on('answer-made', async (data) => {
            const currentPeers = peersInstance.peers;
            const socketPeer = currentPeers[data.socketId];
            await socketPeer.connection.setRemoteDescription(
                new RTCSessionDescription(data.answer),
            );
            console.log(socketPeer.connection.iceConnectionState);
            if (socketPeer.connection.iceConnectionState !== 'connected') {
                const offer = await socketPeer.createOffer();
                client.emit('call-user', {
                    offer,
                    socketId: data.socketId,
                });
            }
        });
        client.on('call-made', async (data) => {
            const currentPeers = peersInstance.peers;
            const peer = currentPeers[data.socketId];
            console.log(peer);
            const answer = await peer.getAnswer(data.offer);
            console.log(data, answer);

            client.emit('make-answer', { answer, socketId: data.socketId });
        });
        client.emit('get-room');
    }, [socket, localStream, peersInstance]);

    useOneCall(() => {
        if (roomStarted && socket.current && localStream) {
            start();
        }
        return () => {
            for (const id in peersInstance.peers) {
                const peer = peersInstance.peers[id];
                peer.clearConnection();
            }
            peersInstance.peers = {};
        };
    }, [roomStarted, localStream]);
    return { users, peers: peersInstance.peers };
};

export default useWebRTC;
