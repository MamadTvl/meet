import { Box, Card, CircularProgress, Typography } from '@mui/material';
import useSwr from 'swr';
import { Api, apiEndpoint, getToken } from '../../utils/Api';
import RoomBox from './RoomBox';

const UserRooms = () => {
    const { data: rooms } = useSwr<
        Array<{ id: string; name: string; isActive: boolean }>
    >(apiEndpoint.room, (key) =>
        Api(key, { headers: { authorization: getToken() } }).then(
            (res) => res.data.rooms,
        ),
    );

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
                <RoomBox {...room} key={room.id} />
            ))}
        </Card>
    );
};

export default UserRooms;
