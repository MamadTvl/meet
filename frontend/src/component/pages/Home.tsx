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

const Home: React.FC = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
    return (
        <Container maxWidth={'lg'} sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent={'center'}>
                <Grid item xs={12}>
                    <Typography align={'center'} variant='h4' gutterBottom>
                        An Open Source Meeting Application
                    </Typography>
                </Grid>
                <Grid
                    xs={12}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ mt: 2 }}>
                    <Button
                        onClick={() => navigate('/login')}
                        sx={{
                            height: 54,
                            width: 218,
                            typography: 'h6',
                        }}
                        variant='contained'
                        color={'primary'}>
                        {'Start the meeting'}
                    </Button>
                    <Typography sx={{ ml: 1, mr: 1 }}>{'or'}</Typography>
                    <Box
                        component={'form'}
                        display={'flex'}
                        alignItems={'center'}>
                        <TextField
                            sx={{width: 340}}
                            placeholder='enter the meeting code'
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            required
                        />
                        <Button
                            disabled={roomId === ''}
                            variant={'text'}
                            onClick={() => navigate('/room/' + roomId)}>
                            Go
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
