import { Box, Button, Grid, Slide, styled, Typography } from '@mui/material';

const Alert = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    zIndex: 2000,
    width: 300,
    padding: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 68,
}));

interface Props {
    users: { name: string; id: string }[];
    open: boolean;
    onMakeDecision: (id: string, decision: boolean) => () => void;
}
const RequestAlert: React.FC<Props> = ({ open, onMakeDecision, users }) => {
    return (
        <Slide in={open}>
            <Alert
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}>
                <Grid container spacing={2}>
                    {users.map((user) => (
                        <Grid item xs={12} key={user.id}>
                            <Typography
                                sx={{mb: 2}}
                                align={
                                    'center'
                                }>{`${user.name} wants to join the room`}</Typography>
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}>
                                <Button
                                    variant='outlined'
                                    onClick={onMakeDecision(user.id, false)}>
                                    {'Reject'}
                                </Button>
                                <Button
                                    sx={{ ml: 1 }}
                                    variant='contained'
                                    onClick={onMakeDecision(user.id, true)}>
                                    {'Accept'}
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Alert>
        </Slide>
    );
};

export default RequestAlert;
