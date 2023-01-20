import { Grid } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import useRoom from '../hooks/useRoom';
import useUserMedia from '../hooks/useUserMedia';
import useWebRTC from '../hooks/useWebRTC';
import { Video } from '../styled/video';

const Meet: React.FC<{ roomId: string }> = ({ roomId }) => {
    console.log('Meet', 'render');

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const { localStream } = useUserMedia({ localVideoRef });
    const {
        socket,
        roomStarted,
        shouldAskForJoin,
        joinToRoom,
        handleNewJoinRequest,
    } = useRoom({ roomId, onNewJoinRequest: useCallback(() => {}, []) });

    const { users, peers } = useWebRTC({
        roomId,
        socket,
        roomStarted,
        localStream,
    });

    // useEffect(() => {
    //     const video = localVideo.current;
    //     if (video) {
    //         console.log(localStream, 'dada');
    //         video.srcObject = localStream;
    //     }
    //     return () => {
    //         // if (localVideo.current) {
    //         //     localVideo.current = null;
    //         // }
    //     };
    // }, [localStream]);
    useEffect(() => {
        console.log(users);
    }, [users]);

    return (
        <Grid container spacing={4}>
            <Grid item xs>
                <Video ref={localVideoRef} autoPlay muted />
            </Grid>
            {users.map((id) => (
                <Grid item xs key={id}>
                    <Video id={id} autoPlay />
                </Grid>
            ))}
        </Grid>
    );
};

export default Meet;
