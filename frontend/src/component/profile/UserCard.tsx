import { Box, Button, Card, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthStore } from '../../store/user';
import FormDialog from '../dialog/FormDialog';
import { useState } from 'react';
import { Api, apiEndpoint } from '../../utils/Api';
import { useSnackbar } from 'notistack';

const UserCard = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useAuthStore((store) => [
        store.user,
        store.setUser,
    ]);

    const handleSubmit = async (body: Record<string, string>) => {
        return Api.patch(apiEndpoint.editMe, body)
            .then((res) => {
                enqueueSnackbar(res.data?.message || 'Ok', {
                    variant: 'success',
                });
                setOpenDialog(false);
                setUser();
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar(
                    err?.response?.data?.message || 'Unexpected Error',
                    {
                        variant: 'error',
                    },
                );
            });
    };

    return (
        <Card sx={{ p: 1.5 }}>
            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{
                    flexDirection: {
                        xs: 'column',
                        sm: 'row',
                    },
                }}
                justifyContent={'space-between'}>
                <Box display={'flex'} alignItems={'center'}>
                    <AccountCircleIcon sx={{mr: 1.5}}  />
                    <Typography>{`${user?.firstName || ''} ${
                        user?.lastName || ''
                    }`}</Typography>
                </Box>
                <Box display={'flex'} alignItems={'center'}>
                    <Button onClick={() => setOpenDialog(true)} variant='outlined'>{'Edit'}</Button>
                    <Button variant='contained' sx={{ ml: 1 }}>
                        {'Logout'}
                    </Button>
                </Box>
            </Box>
            <FormDialog
                open={openDialog}
                close={() => setOpenDialog(false)}
                submit={handleSubmit}
                fields={[
                    {
                        key: 'firstName',
                        label: 'First Name',
                        value: '',
                    },
                    {
                        key: 'lastName',
                        label: 'Last Name',
                        value: '',
                    },
                ]}
                title='Enter your name'
            />
        </Card>
    );
};
export default UserCard;
