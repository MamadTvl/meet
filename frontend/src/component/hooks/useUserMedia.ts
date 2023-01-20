import { useEffect } from 'react';
import { useCallback, useState } from 'react';

interface UseUserMedia {
    localStream: MediaStream | null;
    // isScreenShared: boolean;
    // shareScreen: () => void;
    // stopShareScreen: () => void;
}

interface Args {
    localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

const useUserMedia = (args: Args): UseUserMedia => {
    const { localVideoRef } = args;
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const getUserMedia = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { min: 640, ideal: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: { ideal: 1.7777777778 },
            },
            audio: true,
        });
        setLocalStream(stream);

        const localVideo = localVideoRef.current;
        if (localVideo) {
            localVideo.srcObject = stream;
        }
    }, [localVideoRef]);

    useEffect(() => {
        const localVideo = localVideoRef.current;

        if (localVideo) {
            getUserMedia();
        }
        return () => {
            if (localVideo) {
                // localStream?.getTracks()?.forEach((track) => track.stop());
                localVideo.srcObject = null;
            }
        };
    }, [getUserMedia]);

    return { localStream };
};

export default useUserMedia;
