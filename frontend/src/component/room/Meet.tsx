import { Box, Chip, Container, Grid } from '@mui/material';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Socket } from 'socket.io-client';
import useCalculateCalculate from '../hooks/useCalculateLayout';
import useRoom from '../hooks/useRoom';
import useUserMedia from '../hooks/useUserMedia';
import useWebRTC from '../hooks/useWebRTC';
import {
    MeetContainer,
    StreamChip,
    Video,
    VideoContainer,
} from '../styled/video';
import MeetController from './MeetController';
import RequestAlert from './RequestAlert';

interface Props {
    roomId: string;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
}

const Meet: React.FC<Props> = ({ roomId, roomStarted, socket }) => {
    console.log('Meet', 'render');
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const meetContainerRef = useRef<HTMLDivElement | null>(null);
    const { localStream } = useUserMedia({ localVideoRef });
    const [requestAlertProps, setRequestAlertProps] = useState<{
        open: boolean;
        users: Array<{ name: string; id: string }>;
    }>({
        open: false,
        users: [],
    });
    const onNewJoinRequest = useCallback(
        (data: { name: string; socketId: string }) => {
            setRequestAlertProps((prvState) => ({
                open: true,
                users: [
                    ...prvState.users,
                    { id: data.socketId, name: data.name },
                ],
            }));
        },
        [],
    );

    const { users, peers, handleNewJoinRequest } = useWebRTC({
        roomId,
        socket,
        roomStarted,
        localStream,
        onNewJoinRequest: onNewJoinRequest,
    });

    const onMakeRequestDecision = useCallback(
        (id: string, decision: boolean) => () => {
            handleNewJoinRequest(id, decision);
            setRequestAlertProps((prvState) => ({
                open:
                    prvState.users.filter((user) => user.id !== id).length !==
                    0,
                users: prvState.users.filter((user) => user.id !== id),
            }));
        },
        [handleNewJoinRequest],
    );

    useCalculateCalculate({
        containerRef: meetContainerRef,
        videoCount: users.length + 1,
    });

    return (
        <Box
            margin={0}
            mt={1}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'calc(100vh - 128px)'}>
            <MeetContainer ref={meetContainerRef}>
                <VideoContainer>
                    <Video playsInline ref={localVideoRef} autoPlay muted />
                    <StreamChip label={'You'} color={'secondary'} />
                </VideoContainer>
                {users.map((user) => (
                    <VideoContainer key={user.id}>
                        <Video playsInline id={user.id} autoPlay />
                        <StreamChip label={user.name} color={'secondary'} />
                    </VideoContainer>
                ))}
            </MeetContainer>
            <MeetController />
            <RequestAlert
                {...requestAlertProps}
                onMakeDecision={onMakeRequestDecision}
            />
        </Box>
    );
};

export default Meet;
