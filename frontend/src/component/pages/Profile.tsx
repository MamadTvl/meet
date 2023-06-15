import { Container, Grid } from '@mui/material';
import UserRooms from '../profile/UserRooms';
import AddRoom from '../profile/AddRoom';
import UserCard from '../profile/UserCard';

const Profile = () => {
    return (
        <Container maxWidth={'sm'} sx={{ mt: 6 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <UserCard />
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
