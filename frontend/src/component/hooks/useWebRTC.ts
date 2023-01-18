import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useState } from 'react';
import { Peer } from '../../utils/Peer';
export interface UseWebRTC {
    localStream?: MediaStream;
    peers: { [id: string]: Peer };
}

interface Args {
    roomId: string;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
}

const useWebRTC = (args: Args): UseWebRTC => {
    const { roomId, socket, roomStarted } = args;
    const [localStream, setLocalStream] = useState<MediaStream>();
    const [peers, setPeers] = useState<{ [id: string]: Peer }>({});
    console.log(roomStarted);
    
    useEffect(() => {
        const start = async () => {
            const client = socket.current;
            
            if (!client) {
                return;
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            client.on('user-connected', async (socketId: string) => {
                const peer = new Peer(socketId);
                peer.connection.onicecandidate = (event) => {
                    if (event.candidate) {
                        client.emit('candidate', event.candidate);
                    }
                };
                localStream?.getTracks().forEach((track) => {
                    peer.addTrack(track, localStream);
                });
                peer.connection.ontrack = function ({ streams: [stream] }) {
                    peer.stream = stream;
                };
                const offer = await peer.createOffer();
                client.emit('call-user', { offer, socketId });
                client.on('answer-made', async (data) => {
                    const socketPeer = peers[data.socketId];
                    await socketPeer.connection.setRemoteDescription(
                        new RTCSessionDescription(data.answer),
                    );
                    if (socketPeer.connection.iceConnectionState === 'new') {
                        const offer = await socketPeer.createOffer();
                        client.emit('call-user', { offer, socketId });
                    }
                });
                setPeers((prvState) => ({ ...prvState, [socketId]: peer }));
            });
        };
        if (roomStarted && socket.current) {
            console.log('dad');
            start();
        }
        return () => {
            for (const id in peers) {
                const peer = peers[id];
                peer.clearConnection();
            }
            const client = socket.current;
            if (client) {
                client.emit('leave-room');
                client.off('call-user');
                client.off('answer-made');
                client.close();
                socket.current = null;
            }
            localStream?.getTracks().forEach((track) => track.stop());
        };
    }, [roomId, roomStarted]);

    return { localStream, peers };
};

export default useWebRTC;
