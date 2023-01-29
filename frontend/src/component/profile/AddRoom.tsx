import { Card, Box, Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { Api, apiEndpoint, getToken } from '../../utils/Api';
import { mutate } from "swr"

const AddRoom = () => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Api(apiEndpoint.room, {
                method: 'POST',
                data: {
                    name: value,
                },
                headers: {
                    authorization: getToken(),
                },
            });
            enqueueSnackbar(res.data.message, { variant: 'success' });
            mutate(apiEndpoint.room);
            setValue('');
        } catch (err: any) {
            const message = err.response.message;
            enqueueSnackbar(message, { variant: 'error' });
        }
        setLoading(false);
    }, [enqueueSnackbar, value]);

    return (
        <Card sx={{ p: 1.5 }}>
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}>
                <TextField
                    variant='standard'
                    placeholder='new room name'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button
                    variant='contained'
                    sx={{ ml: 1 }}
                    onClick={handleClick}
                    disabled={value === '' || loading}>
                    {'Add'}
                </Button>
            </Box>
        </Card>
    );
};

export default AddRoom;
