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
    audioToggle: () => void;
    videoToggle: () => void;
    muted: boolean;
    videoOff: boolean;
}

export interface SocketUser {
    id: string;
    name: string;
    muted: boolean;
    videoOff: boolean;
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
    const [muted, setMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    // const peers = useRef<{ [id: string]: Peer }>({});

    const start = useCallback(() => {
        const client = socket.current;
        if (!client) {
            return;
        }
        console.log('start');

        client.once('room-users', async (users: SocketUser[]) => {
            const initialUsers: SocketUser[] = [];
            for (const { id, name, muted, videoOff } of users) {
                const peer = new Peer(id);
                peer.init(localStream, !videoOff, !muted);
                initialUsers.push({ id, name, muted, videoOff });
                peersInstance.add(id, peer);
            }
            setUsers(initialUsers);
            client.emit('ready-to-connect');
        });
        client.on('user-connected', async (data: SocketUser) => {
            const { id: socketId, muted, videoOff } = data;
            if (peersInstance.peers[socketId]) {
                return;
            }
            const peer = new Peer(socketId);
            peer.connection.onicecandidate = (event) => {
                if (event.candidate) {
                    client.emit('make-candidate', {
                        candidate: event.candidate,
                        socketId,
                    });
                }
            };
            peer.init(localStream, !videoOff, !muted);
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
        client.on(
            'candidate-made',
            (data: { socketId: string; iceCandidate: RTCIceCandidate }) => {
                const currentPeers = peersInstance.peers;
                const peer = currentPeers[data.socketId];
                peer.addIceCandidate(data.iceCandidate);
            },
        );
        client.on(
            'action-made',
            (action: {
                data: { type: 'audio' | 'video'; off: boolean };
                socketId: string;
            }) => {
                const {
                    data: { type, off },
                    socketId,
                } = action;
                setUsers((prv) => {
                    const copy = structuredClone(prv);
                    const userIndex = copy.findIndex(
                        (user) => user.id === socketId,
                    );
                    if (userIndex === -1) {
                        return prv;
                    }
                    if (type === 'audio') {
                        copy[userIndex].muted = off;
                    } else if (type === 'video') {
                        copy[userIndex].videoOff = off;
                    }
                    return copy;
                });
            },
        );
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

    const emitAction = useCallback(
        (type: 'audio' | 'video', off: boolean) => {
            socket.current?.emit('make-action', { type, off });
        },
        [socket],
    );

    const videoToggle = useCallback(() => {
        if (!localStream) {
            return;
        }
        const enabled = localStream.getVideoTracks()[0].enabled;

        localStream.getVideoTracks()[0].enabled = !enabled;
        for (const id in peersInstance.peers) {
            const peer = peersInstance.peers[id];
            if (enabled) {
                peer.removeTrack('video');
            } else {
                peer.replaceTrack(localStream, 'video');
            }
        }
        setVideoOff((prv) => {
            emitAction('video', !prv);
            return !prv;
        });
    }, [emitAction, localStream, peersInstance.peers]);

    const audioToggle = useCallback(() => {
        if (!localStream) {
            return;
        }
        const enabled = localStream.getAudioTracks()[0].enabled;

        localStream.getAudioTracks()[0].enabled = !enabled;
        for (const id in peersInstance.peers) {
            const peer = peersInstance.peers[id];
            if (enabled) {
                peer.removeTrack('audio');
            } else {
                peer.replaceTrack(localStream, 'audio');
            }
        }
        setMuted((prv) => {
            emitAction('audio', !prv);
            return !prv;
        });
    }, [emitAction, localStream, peersInstance.peers]);

    return {
        users,
        peers: peersInstance.peers,
        handleNewJoinRequest,
        audioToggle,
        videoToggle,
        muted,
        videoOff,
    };
};

export default useWebRTC;
