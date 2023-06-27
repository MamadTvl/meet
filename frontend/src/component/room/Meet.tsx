import { Box, Chip, Container, Grid } from '@mui/material';
import React, {
    CSSProperties,
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
    VideoPlaceHolder,
} from '../styled/video';
import MeetController from './MeetController';
import RequestAlert from './RequestAlert';
import MicOffIcon from '@mui/icons-material/MicOff';
interface Props {
    roomId: string;
    socket: React.MutableRefObject<Socket | null>;
    roomStarted: boolean;
}

const Meet: React.FC<Props> = ({ roomId, roomStarted, socket }) => {
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

    const {
        users,
        audioToggle,
        videoToggle,
        handleNewJoinRequest,
        muted,
        videoOff,
    } = useWebRTC({
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

    const hiddenStyle: CSSProperties = {
        display: 'none',
        visibility: 'hidden',
        opacity: 0,
    };
    const visibleStyle: CSSProperties = {
        visibility: 'visible',
        opacity: 1,
    };

    const muteIcon = (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
                position: 'absolute',
                right: 16,
                bottom: 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'secondary.dark',
            }}
            bgcolor={'secondary'}>
            <MicOffIcon />
        </Box>
    );

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
                    <VideoPlaceHolder
                        style={videoOff ? visibleStyle : hiddenStyle}
                    />
                    <Video style={videoOff ? hiddenStyle : visibleStyle} playsInline ref={localVideoRef} autoPlay muted />
                    <StreamChip label={'You'} color={'secondary'} />
                    {muted && muteIcon}
                </VideoContainer>
                {users.map((user) => (
                    <VideoContainer key={user.id}>
                        <VideoPlaceHolder
                            style={user.videoOff ? visibleStyle : hiddenStyle}
                        />
                        <Video
                            style={user.videoOff ? hiddenStyle : visibleStyle}
                            playsInline
                            id={user.id}
                            autoPlay
                        />
                        <StreamChip label={user.name} color={'secondary'} />
                        {user.muted && muteIcon}
                    </VideoContainer>
                ))}
            </MeetContainer>
            <MeetController
                muted={muted}
                videoOff={videoOff}
                audioToggle={audioToggle}
                videoToggle={videoToggle}
            />
            <RequestAlert
                {...requestAlertProps}
                onMakeDecision={onMakeRequestDecision}
            />
        </Box>
    );
};

export default Meet;
