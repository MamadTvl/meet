import { Box, Chip, styled } from '@mui/material';

export const MeetContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: 'calc(var(--width) * var(--cols))',
});

export const VideoContainer = styled('div')({
    boxSizing: 'border-box',
    position: 'relative',
    width: 'var(--width)',
    height: 'var(--height)',
});

export const StreamChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    bottom: 16,
    left: 16,
}));

export const Video = styled('video')({
    transition: 'opacity .3s',
    height: '100%',
    width: '100%',
});

export const VideoPlaceHolder = styled(Box)({
    transition: 'opacity .3s',
    height: '100%',
    width: '100%',
    background: '#000'
});
