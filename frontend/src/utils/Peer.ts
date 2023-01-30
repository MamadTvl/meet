export class Peer {
    public connection: RTCPeerConnection;
    public stream: MediaStream | null = null;

    constructor(public id: string) {
        this.connection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: import.meta.env.VITE_CUSTOM_TURN_SERVER,
                    username: import.meta.env.VITE_CUSTOM_TURN_SERVER_USERNAME,
                    credential: import.meta.env.VITE_CUSTOM_TURN_PASSWORD
                },
            ],
        });
    }

    public init(localStream: MediaStream | null) {
        console.log(localStream);

        localStream?.getTracks().forEach((track) => {
            this.addTrack(track, localStream);
        });
        this.connection.ontrack = ({ streams: [stream] }) => {
            console.log(stream);

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
