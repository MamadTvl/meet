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

    useEffect(() => {
        const localVideo = localVideoRef.current;
        if (!localVideo) {
            return;
        }
        let stream: MediaStream | null = null;
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { min: 640, ideal: 1920 },
                    height: { min: 400, ideal: 1080 },
                    aspectRatio: { ideal: 1.7777777778 },
                },
                audio: true,
            })
            .then((media) => {
                stream = media;
                setLocalStream(media);
                const localVideo = localVideoRef.current;
                if (localVideo) {
                    localVideo.srcObject = stream;
                }
            });

        return () => {
            stream?.getTracks()?.forEach((track) => track.stop());
        };
    }, [localVideoRef]);

    return { localStream };
};

export default useUserMedia;
