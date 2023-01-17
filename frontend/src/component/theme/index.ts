import { LinkProps, ThemeOptions } from '@mui/material';
import { LinkBehavior } from '../link/Link';
import './theme';

export const darkPalette: ThemeOptions['palette'] = {
    mode: 'dark',
    primary: {
        light: '#33c9dc',
        main: '#00bcd4',
        dark: '#008394',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ffd54f',
        main: '#ffc107',
        dark: '#ffa000',
        contrastText: '#fff',
    },
    background: {
        lightest: '#333',
        light: '#333',
        default: '#333',
        paper: '#333',
        dark: '#f5f5f5',
        contrastText: '#fff',
    },
    text: {
        primary: '#f5f5f5',
        secondary: '#f5f5f5',
    },
};

export const lightPalette: ThemeOptions['palette'] = {
    mode: 'light',
    primary: {
        light: '#33c9dc',
        main: '#00bcd4',
        dark: '#008394',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ffd54f',
        main: '#ffc107',
        dark: '#ffa000',
        contrastText: '#fff',
    },
    background: {
        lightest: '#f5f5f5',
        light: '#f5f5f5',
        default: '#f5f5f5',
        paper: '#f5f5f5',
        dark: '#333',
        contrastText: '#fff',
    },
    text: {
        primary: '#333',
        secondary: '#333',
    },
    success: {
        main: '#00A76B',
    },
    warning: {
        main: '#FF9838',
    },
    error: {
        main: '#EF2253',
    },
    golden: {
        main: '#FFDE00',
    },
    hyperlink: {
        main: '#31A8FF',
    },
};

export const themeInitialOptions = (
    prefersDarkMode: boolean,
): ThemeOptions => ({
    breakpoints: {
        values: {
            xs: 0,
            sm: 750,
            md: 900,
            lg: 1280,
            xl: 1366,
        },
    },

    palette: prefersDarkMode ? darkPalette : lightPalette,
    typography: {
        fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: '600',
            fontSize: '3.5rem',
            lineHeight: '1.2',
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontWeight: '600',
            fontSize: '2.8125rem',
            lineHeight: '1.2',
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontWeight: '600',
            fontSize: '2.125rem',
            lineHeight: '1.2',
            letterSpacing: '0',
        },
        h4: {
            fontWeight: '600',
            fontSize: '1.5rem',
            lineHeight: '1.2',
            letterSpacing: '0.00735em',
        },
        h5: {
            fontWeight: '600',
            fontSize: '1.25rem',
            lineHeight: '1.2',
            letterSpacing: '0',
        },
        h6: {
            fontWeight: '600',
            fontSize: '1rem',
            lineHeight: '1.2',
            letterSpacing: '0.0075em',
        },
        body1: {
            fontWeight: '400',
            fontSize: '1rem',
            lineHeight: '1.5',
            letterSpacing: '0.00938em',
        },
        body2: {
            fontWeight: '400',
            fontSize: '0.875rem',
            lineHeight: '1.43',
            letterSpacing: '0.01071em',
        },
        button: {
            fontWeight: '500',
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 4,
    },
    spacing: 8,
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            } as LinkProps,
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    },
});
