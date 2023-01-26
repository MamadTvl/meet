import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createPeers, Peer } from '../../utils/Peer';
import useOneCall from './useOneCall';
export interface UseWebRTC {
    users: SocketUser[];
    peers: {
        [id: string]: Peer;
    };
    handleNewJoinRequest: (socketId: string, decision: boolean) => void;
}

export interface SocketUser {
    id: string;
    name: string;
}

interface Args {
    roomId: string;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
    localStream: MediaStream | null;
    onNewJoinRequest: (data: { name: string; socketId: string }) => void;
}

const useWebRTC = (args: Args): UseWebRTC => {
    const { socket, roomStarted, localStream, onNewJoinRequest } = args;
    const [users, setUsers] = useState<SocketUser[]>([]);
    const peersInstance = useMemo(() => createPeers(), []);
    // const peers = useRef<{ [id: string]: Peer }>({});

    const start = useCallback(() => {
        const client = socket.current;
        if (!client) {
            return;
        }
        console.log('start');

        client.once('room-users', async (users: SocketUser[]) => {
            const initialUsers: SocketUser[] = [];
            for (const { id, name } of users) {
                const peer = new Peer(id);
                peer.init(localStream);
                initialUsers.push({ id, name });
                peersInstance.add(id, peer);
            }
            setUsers(initialUsers);
            client.emit('ready-to-connect');
        });
        client.on('user-connected', async (data: SocketUser) => {
            const { id: socketId } = data;
            if (peersInstance.peers[socketId]) {
                return;
            }
            const peer = new Peer(socketId);
            peer.init(localStream);
            const offer = await peer.createOffer();
            peersInstance.add(socketId, peer);
            setUsers((prvState) => [...prvState, data]);
            client.emit('call-user', { offer, socketId });
        });
        client.on('user-disconnected', (socketId: string) => {
            const peer = peersInstance.peers[socketId];
            if (!peer) {
                return;
            }
            peer.clearConnection();
            peersInstance.remove(socketId);
            setUsers((prvState) =>
                prvState.filter((user) => user.id !== socketId),
            );
        });
        client.on('new-request', onNewJoinRequest);
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
    }, [socket, localStream, peersInstance, onNewJoinRequest]);

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

    const handleNewJoinRequest = useCallback(
        (socketId: string, decision: boolean) => {
            socket.current?.emit('joining-decision', { socketId, decision });
        },
        [socket],
    );

    return { users, peers: peersInstance.peers, handleNewJoinRequest };
};

export default useWebRTC;
