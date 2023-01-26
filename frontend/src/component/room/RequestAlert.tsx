import { Box, Button, Slide, styled, Typography } from '@mui/material';

const Alert = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    zIndex: 2000,
    width: 300,
    padding: 8,
    borderRadius: 4,
    height: 100,
    position: 'absolute',
    top: 68,
}));

interface Props {
    name: string;
    id: string;
    open: boolean;
    onMakeDecision: (decision: boolean) => () => void;
}
const RequestAlert: React.FC<Props> = ({ name, id, open, onMakeDecision }) => {
    return (
        <Slide in={open}>
            <Alert
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}>
                <Typography
                    align={
                        'center'
                    }>{`${name} wants to join the room`}</Typography>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-end'}>
                    <Button variant='outlined' onClick={onMakeDecision(false)}>
                        {'Reject'}
                    </Button>
                    <Button
                        sx={{ ml: 1 }}
                        variant='contained'
                        onClick={onMakeDecision(true)}>
                        {'Accept'}
                    </Button>
                </Box>
            </Alert>
        </Slide>
    );
};

export default RequestAlert;
