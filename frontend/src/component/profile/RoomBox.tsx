import { Box, IconButton, styled, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VideoChatIcon from '@mui/icons-material/VideoChat';
import { useNavigate } from 'react-router-dom';
import FormDialog, { Field } from '../dialog/FormDialog';
import { useState } from 'react';
import { Api, apiEndpoint } from '../../utils/Api';
import { useSnackbar } from 'notistack';
import { mutate } from 'swr';

const RoomContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    padding: 10,
}));

const Bullet = styled('div')(({ theme }) => ({
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    opacity: 0.4,
    width: 12,
    height: 12,
    marginRight: 8,
}));

type Props = {
    id: string;
    name: string;
    isActive: boolean;
};

const RoomBox: React.FC<Props> = ({ id, isActive, name }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const handleEdit = async (body: Record<string, string>) => {
        return Api.patch(`${apiEndpoint.room}/${id}`, body)
            .then((res) => {
                enqueueSnackbar(res.data?.message || 'Ok', {
                    variant: 'success',
                });
                setOpen(false);
                mutate(apiEndpoint.room);
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
        <RoomContainer>
            <Box display={'flex'} alignItems={'center'}>
                <Bullet />
                <Typography color={'secondary'}>{name}</Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'}>
                <IconButton onClick={() => setOpen(true)}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => navigate(`/room/${id}`)}>
                    <VideoChatIcon />
                </IconButton>
            </Box>
            <FormDialog
                open={open}
                close={() => setOpen(false)}
                submit={handleEdit}
                fields={[
                    {
                        key: 'name',
                        label: 'Name',
                        value: name,
                    },
                ]}
                title='Enter new Name for your room'
            />
        </RoomContainer>
    );
};

export default RoomBox;
