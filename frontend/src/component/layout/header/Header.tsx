import {
    AppBar,
    Box,
    Slide,
    Toolbar,
    Typography,
    useScrollTrigger,
    Link,
} from '@mui/material';
import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import Logo from '../../../assets/linom.svg';
import HeaderButtons from './HeaderButtons';

const Header = () => {
    const trigger = useScrollTrigger();
    const location = useLocation();

    return (
        <>
            <Slide appear={false} direction='down' in={!trigger}>
                <AppBar sx={{ backgroundColor: 'background.paper' }}>
                    <Toolbar>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            width={1}>
                            <Link href={'/'} underline={'none'}>
                                <Box display={'flex'} alignItems={'center'}>
                                    <img
                                        src={Logo}
                                        alt={'linom'}
                                        width={40}
                                        height={40}
                                    />
                                    <Typography sx={{display: {xs: 'none', sm: 'block'}}} variant='h6' color={'primary'}>
                                        {'Linom Meet'}
                                    </Typography>
                                </Box>
                            </Link>
                            <HeaderButtons />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Slide>
            <Toolbar />
        </>
    );
};

export default Header;
