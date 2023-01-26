import { styled } from '@mui/material';

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

export const Video = styled('video')({
    height: '100%',
    width: '100%',
});
