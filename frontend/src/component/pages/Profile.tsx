import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthStore } from '../../store/user';
import UserRooms from '../profile/UserRooms';
import AddRoom from '../profile/AddRoom';

const Profile = () => {
    const user = useAuthStore((store) => store.user);

    return (
        <Container maxWidth={'sm'} sx={{ mt: 6 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} >
                    <Card sx={{ p: 1.5 }}>
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}>
                            <Box display={'flex'} alignItems={'center'}>
                                <AccountCircleIcon />
                                <Typography>{`${user?.firstName || ''} ${
                                    user?.lastName || ''
                                }`}</Typography>
                            </Box>
                            <Box display={'flex'} alignItems={'center'}>
                                <Button variant='outlined'>{'Edit'}</Button>
                                <Button variant='contained' sx={{ ml: 1 }}>
                                    {'Logout'}
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <AddRoom />
                </Grid>
                <Grid item xs={12}>
                    <UserRooms />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
