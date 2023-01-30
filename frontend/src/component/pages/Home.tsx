import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    styled,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/user';

const Home: React.FC = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    const isLogin = useAuthStore((store) => store.isLogin);
    return (
        <Container maxWidth={'lg'} sx={{ mt: 2 }}>
            <Grid container spacing={5} justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography align={'center'} variant='h4' gutterBottom>
                        The Simple Meeting Application You Always Wanted
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                    display={'flex'}
                    justifyContent={'center'}
                    sx={{
                        flexDirection: {
                            xs: 'column',
                            md: 'row',
                        },
                    }}
                    alignItems={'center'}>
                    <Button
                        onClick={() =>
                            navigate(isLogin ? '/profile' : '/login')
                        }
                        sx={{
                            height: 54,
                            width: 218,
                            typography: 'h6',
                        }}
                        variant='contained'
                        color={'primary'}>
                        {'Start the meeting'}
                    </Button>
                    <Typography
                        sx={{
                            ml: { xs: 0, sm: 1 },
                            mr: { xs: 0, sm: 1 },
                            mt: { xs: 1.5, sm: 0 },
                            mb: { xs: 1.5, sm: 0 },
                        }}>
                        {'or'}
                    </Typography>
                    <Box
                        component={'form'}
                        display={'flex'}
                        onSubmit={() => navigate('/room/' + roomId)}
                        alignItems={'center'}>
                        <TextField
                            sx={{ width: { xs: 220, sm: 340 } }}
                            placeholder='enter the meeting code'
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            required
                        />
                        <Button
                            disabled={roomId === ''}
                            variant={'text'}
                            type={'submit'}>
                            Go
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
