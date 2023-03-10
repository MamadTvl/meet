import { Box, IconButton, styled } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useNavigate } from 'react-router-dom';

const Controller = styled(Box)(({ theme }) => ({
    padding: 4,
    borderRadius: 4,
    width: 300,
    backgroundColor: theme.palette.background.paper,
}));

const MeetController = () => {
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
