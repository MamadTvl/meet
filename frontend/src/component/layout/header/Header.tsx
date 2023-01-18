import {
    AppBar,
    Box,
    Slide,
    Toolbar,
    Typography,
    useScrollTrigger,
    Link,
} from '@mui/material';
import Logo from '../../../assets/linom.svg';
import HeaderButtons from './HeaderButtons';

const Header = () => {
    const trigger = useScrollTrigger();
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
                                    <Typography variant='h6' color={'primary'}>
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
