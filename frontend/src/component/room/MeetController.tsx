import { Box, IconButton, styled } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

const Controller = styled(Box)(({ theme }) => ({
    padding: 4,
    borderRadius: 4,
    width: 300,
    backgroundColor: theme.palette.background.paper,
}));

const MeetController: FC<{
    audioToggle: () => void;
    videoToggle: () => void;
    muted: boolean;
    videoOff: boolean;
}> = ({ audioToggle, videoToggle, muted, videoOff }) => {
    const navigate = useNavigate();
    return (
        <Controller
            display={'flex'}
            position={'absolute'}
            bottom={24}
            justifyContent={'space-between'}>
            <IconButton onClick={() => navigate('/')}>
                <CallEndIcon color={'error'} />
            </IconButton>
            <IconButton>
                <ScreenShareIcon />
            </IconButton>
            <IconButton onClick={audioToggle}>
                {muted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            <IconButton onClick={videoToggle}>
                {videoOff ? (
                    <VideocamOffIcon />
                ) : (
                    <VideocamIcon />
                )}
                
            </IconButton>
        </Controller>
    );
};

export default MeetController;
