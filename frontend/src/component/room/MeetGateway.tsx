import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { UseRoom } from '../hooks/useRoom';
import useUserMedia from '../hooks/useUserMedia';
import { Video } from '../styled/video';
import MeetGatewayActions from './MeetGatewayActions';

interface Props {
    joinLoading: boolean;
    joinToRoom: UseRoom['joinToRoom'];
    shouldAskForJoin: boolean;
    setShowGateway: Dispatch<SetStateAction<boolean>>;
}

const MeetGateway: React.FC<Props> = (props) => {
    const { joinLoading, joinToRoom, shouldAskForJoin, setShowGateway } = props;
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useUserMedia({
        localVideoRef: videoRef,
    });

    return (
        <Container maxWidth={'lg'} sx={{ pt: 6 }}>
            <Grid
                container
                spacing={3}
                alignItems={'center'}
                direction={'column'}>
                <Grid item xs={12}>
                    <Video
                        ref={videoRef}
                        autoPlay
                        muted
                        sx={{ borderRadius: 8, maxWidth: 600 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MeetGatewayActions
                        joinLoading={joinLoading}
                        setShowGateway={setShowGateway}
                        joinToRoom={joinToRoom}
                        shouldAskForJoin={shouldAskForJoin}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default MeetGateway;
