import io, { Socket } from 'socket.io-client';
export class Peer {
    public connection: RTCPeerConnection;
    public stream: MediaStream | null = null;

    constructor(public id: string) {
        this.connection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
    }
    // call-user (send offer)
    public async createOffer(): Promise<RTCSessionDescriptionInit> {
        const offer = await this.connection.createOffer();
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

    public clearConnection() {
        this.connection.close();
    }
}
