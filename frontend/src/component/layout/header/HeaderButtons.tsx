import { Button, ButtonGroup, IconButton, Link } from '@mui/material';
import { useAuthStore } from '../../../store/user';
import ToggleTheme from './ToggleTheme';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderButtons = () => {
    const [authLoading, isLogin] = useAuthStore((store) => [
        store.loading,
        store.isLogin,
    ]);

    return (
        <ButtonGroup>
            {isLogin && !authLoading && (
                <Link href={'/profile'} underline={'none'}>
                    <IconButton>
                        <AccountCircleIcon />
                    </IconButton>
                </Link>
            )}
            {!isLogin && !authLoading && (
                <>
                    <Link href={'/login'} underline={'none'}>
                        <Button variant={'contained'} color={'primary'}>
                            {'login'}
                        </Button>
                    </Link>
                    <Link
                        href={'/sign-up'}
                        sx={{ ml: 1.2, mr: 1 }}
                        underline={'none'}>
                        <Button variant='outlined' color={'primary'}>
                            {'sign up'}
                        </Button>
                    </Link>
                </>
            )}
            <ToggleTheme />
        </ButtonGroup>
    );
};

export default HeaderButtons;
