export class Peer {
    public connection: RTCPeerConnection;
    public stream: MediaStream | null = null;

    constructor(public id: string) {
        const iceServers: RTCIceServer[] = [];
        iceServers.push({
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
            ],
        });
        const hasTurnServer = import.meta.env.VITE_CUSTOM_TURN_SERVER !== '';
        if (hasTurnServer) {
            iceServers.push({
                urls: import.meta.env.VITE_CUSTOM_TURN_SERVER,
                username: import.meta.env.VITE_CUSTOM_TURN_SERVER_USERNAME,
                credential: import.meta.env.VITE_CUSTOM_TURN_SERVER_PASSWORD,
            });
        }
        this.connection = new RTCPeerConnection({
            iceServers,
        });
    }

    public init(localStream: MediaStream | null, video: boolean, audio: boolean) {
        if (video) {
            localStream?.getVideoTracks().forEach((track) => {
                this.addTrack(track, localStream);
            });
        }
        if (audio) {
            localStream?.getAudioTracks().forEach((track) => {
                this.addTrack(track, localStream);
            });
        }
        this.connection.ontrack = ({ streams: [stream] }) => {
            const video = this.getVideoElement();
            if (video) {
                video.srcObject = stream;
            }
            this.stream = stream;
        };
    }

    // call-user (send offer)
    public async createOffer(): Promise<RTCSessionDescriptionInit> {
        const offer = await this.connection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
        });
        await this.connection.setLocalDescription(
            new RTCSessionDescription(offer),
        );
        return offer;
    }

    public async getAnswer(
        offer: RTCSessionDescription,
    ): Promise<RTCSessionDescriptionInit> {
        await this.connection.setRemoteDescription(
            new RTCSessionDescription(offer),
        );
        const answer = await this.connection.createAnswer();
        await this.connection.setLocalDescription(
            new RTCSessionDescription(answer),
        );
        return answer;
    }

    public async addIceCandidate(candidate: RTCIceCandidate) {
        await this.connection.addIceCandidate(candidate);
    }

    public addTrack(track: MediaStreamTrack, stream: MediaStream) {
        this.connection.addTrack(track, stream);
    }

    public removeTrack(type: 'video' | 'audio') {
        this.connection.getSenders().forEach((sender) => {
            if (sender.track?.kind === type) {
                this.connection.removeTrack(sender);
            }
        });
    }

    public async replaceTrack(
        localStream: MediaStream,
        type: 'video' | 'audio',
    ) {
        for (const s of this.connection.getSenders()) {
            if (s.track?.kind == null || s.track?.kind === type) {
                try {
                    let track = localStream.getVideoTracks()[0];
                    if (type === 'audio') {
                        track = localStream.getAudioTracks()[0];
                    }
                    await s.replaceTrack(track);
                } catch {}
            }
        }
        for (const t of this.connection.getTransceivers()) {
            if (t.sender.track?.kind == null || t.sender.track.kind === type) {
                t.direction = 'sendrecv';
            }
        }
    }

    public getVideoElement(): HTMLVideoElement | null {
        return document.getElementById(this.id) as HTMLVideoElement | null;
    }

    public clearConnection() {
        this.connection.close();
    }
}
export const createPeers = (): {
    peers: { [id: string]: Peer };
    add(id: string, peer: Peer): void;
    remove(id: string): void;
} => {
    return {
        peers: {},
        add(id: string, peer: Peer) {
            this.peers[id] = peer;
        },
        remove(id: string) {
            delete this.peers[id];
        },
    };
};
