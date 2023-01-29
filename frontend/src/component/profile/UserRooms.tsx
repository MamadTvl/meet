import {
    Box,
    Card,
    CircularProgress,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import useSwr from 'swr';
import { Api, apiEndpoint, getToken } from '../../utils/Api';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const RoomBox = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    padding: 10,
}));

const Bullet = styled('div')(({ theme }) => ({
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    opacity: 0.4,
    width: 12,
    height: 12,
    marginRight: 8,
}));

const UserRooms = () => {
    const { data: rooms, mutate } = useSwr<
        Array<{ id: string; name: string; isActive: boolean }>
    >(apiEndpoint.room, (key) =>
        Api(key, { headers: { authorization: getToken() } }).then(
            (res) => res.data.rooms,
        ),
    );
    const navigate = useNavigate();

    return (
        <Card sx={{ p: 1.5 }}>
            <Typography align={'center'} variant='h6' mb={4}>
                {'Your Rooms'}
            </Typography>
            {!rooms && (
                <Box display={'flex'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            )}
            {rooms?.map((room) => (
                <RoomBox key={room.id}>
                    <Box display={'flex'} alignItems={'center'}>
                        <Bullet />
                        <Typography color={'secondary'}>{room.name}</Typography>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => navigate(`/room/${room.id}`)}>
                            <VideoChatIcon />
                        </IconButton>
                    </Box>
                </RoomBox>
            ))}
        </Card>
    );
};

export default UserRooms;
