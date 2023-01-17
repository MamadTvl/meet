import React from 'react';
import PropTypes from 'prop-types';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { darkPalette, lightPalette, themeInitialOptions } from '..';

export const DispatchContext = React.createContext(() => {
    throw new Error('Forgot to wrap component in `ThemeProvider`');
});

if (process.env.NODE_ENV !== 'production') {
    DispatchContext.displayName = 'ThemeDispatchContext';
}

function ThemeProvider(props) {
    const { children } = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeOptions, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE':
                    return {
                        ...state,
                        palette:
                            state.palette.mode === 'dark'
                                ? lightPalette
                                : darkPalette,
                    };
                default:
                    throw new Error(`Unrecognized type ${action.type}`);
            }
        },
        { ...themeInitialOptions(prefersDarkMode) },
    );

    const theme = React.useMemo(() => {
        return createTheme(
            {
                ...themeOptions,
            },
            { index: 1 },
        );
    }, [themeOptions]);

    return (
        <MuiThemeProvider theme={theme}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </MuiThemeProvider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export function useChangeTheme() {
    const dispatch = React.useContext(DispatchContext);
    return React.useCallback(
        (options) => dispatch({ type: 'CHANGE', payload: options }),
        [dispatch],
    );
}

export default ThemeProvider;
