import { Box, Button, IconButton, Paper, styled } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';

const Controller = styled(Box)(({ theme }) => ({
    padding: 4,
    borderRadius: 4,
    width: 300,
    backgroundColor: theme.palette.background.paper,
}));

const MeetController = () => {
    return (
        <Controller
            display={'flex'}
            position={'absolute'}
            bottom={24}
            justifyContent={'space-between'}>
            <IconButton>
                <CallEndIcon color={'error'} />
            </IconButton>
            <IconButton>
                <ScreenShareIcon />
            </IconButton>
            <IconButton>
                <MicIcon />
            </IconButton>
            <IconButton>
                <VideocamIcon />
            </IconButton>
        </Controller>
    );
};

export default MeetController;
