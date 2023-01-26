import {
    Button,
    CircularProgress,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useAuthStore } from '../../store/user';
import { UseRoom } from '../hooks/useRoom';

interface Props {
    joinLoading: boolean;
    shouldAskForJoin: boolean;
    joinToRoom: UseRoom['joinToRoom'];
    setShowGateway: React.Dispatch<React.SetStateAction<boolean>>;
}

const MeetGatewayActions: React.FC<Props> = ({
    joinLoading,
    shouldAskForJoin,
    joinToRoom,
    setShowGateway,
}) => {
    const [askResultLoading, setAskResultLoading] = useState(false);
    const [isLogin, authLoading] = useAuthStore((store) => [
        store.isLogin,
        store.loading,
    ]);
    const [name, setName] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        setAskResultLoading(true);
        if (shouldAskForJoin) {
            joinToRoom({ name }, (data) => {
                if (data.result) {
                    setShowGateway(false);
                } else {
                    enqueueSnackbar(
                        `sorry, you can't join the room since the admin reject your request`,
                        { variant: 'error' },
                    );
                }
                setAskResultLoading(false);
            });
        } else {
            setAskResultLoading(false);
            setShowGateway(false);
        }
    };

    const showGuestInput = useMemo(() => {
        return !isLogin && !authLoading;
    }, [isLogin, authLoading]);

    const showUserTypo = useMemo(() => {
        return isLogin && !authLoading;
    }, [isLogin, authLoading]);

    return (
        <Grid
            container
            spacing={2}
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}>
            {joinLoading ? (
                <Grid item xs={12}>
                    <CircularProgress size={24} />
                </Grid>
            ) : (
                <>
                    {showGuestInput && (
                        <>
                            <Grid item xs={12}>
                                <Typography>{'What is Your Name ?'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    variant='outlined'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>
                        </>
                    )}
                    {showUserTypo && (
                        <>
                            <Grid item xs={6}>
                                <Typography>{'Room is Ready'}</Typography>
                            </Grid>
                        </>
                    )}
                    {!authLoading && (
                        <Grid item xs={12}>
                            <Button
                                variant='outlined'
                                fullWidth
                                disabled={askResultLoading}
                                onClick={handleClick}>
                                {shouldAskForJoin ? 'Ask To Join' : 'Join'}
                            </Button>
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    );
};

export default MeetGatewayActions;
