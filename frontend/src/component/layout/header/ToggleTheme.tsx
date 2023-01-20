import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useChangeTheme } from '../../theme/context/ThemeProvider';

const ToggleTheme = () => {
    const theme = useTheme();
    const toggleTheme = useChangeTheme();
    
    return (
        <IconButton onClick={toggleTheme}>
            {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
            ) : (
                <Brightness4Icon />
            )}
        </IconButton>
    );
};
export default ToggleTheme;