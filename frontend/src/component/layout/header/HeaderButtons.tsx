import { Button, ButtonGroup, Link } from '@mui/material';
import ToggleTheme from './ToggleTheme';

const HeaderButtons = () => {
    return (
        <ButtonGroup>
            <Link href={'/login'} underline={'none'}>
                <Button variant={'contained'} color={'primary'}>
                    {'login'}
                </Button>
            </Link>
            <Link href={'/sign-up'} sx={{ ml: 1.2, mr: 1 }} underline={'none'}>
                <Button variant='outlined' color={'primary'}>
                    {'sign up'}
                </Button>
            </Link>
            <ToggleTheme />
        </ButtonGroup>
    );
};

export default HeaderButtons;
